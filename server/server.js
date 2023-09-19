const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const mino = require('beatsify');

const mongoose = require('mongoose');
const User = require("./User");

const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const port = 5000;
const { v2, auth } = require('osu-api-extended');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const uri = process.env.DB_CONNECTION;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to the database");
}).catch((error) => {
    console.error("Error connecting to the database:", error);
})

const pushOrReplaceObjects = async (existingArray, newArray) => {
    newArray.forEach(newObj => {
        const index = existingArray.findIndex(existingObj => existingObj.date.getTime() === newObj.date.getTime());

        if (index !== -1) {
            existingArray[index] = newObj; // Replace existing object with the new object
        } else {
            existingArray.push(newObj); // Add new object to the existing array
        }
    });
}

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/proxy/', async (req, res) => {
    try {
        const url = req.body.url;
        const response = await axios.get(url, {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "aplication/json"
        });
        res.send(response.data);
    } catch (err) {
        res.status(500).send({ error: err.toString });
    }
});

const main = async () => {
    await auth.login(client_id, client_secret, ['public'])
}
main().then(() => console.log('Application Logged in'));

app.post('/userQuery', async (req, res) => {
    try {
        const username = req.body.username;
        const queryObject = {
            mode: 'user',
            query: username,
            page: 0
        }
        const data = await v2.site.search(queryObject)
        res.send(data);
    } catch (err) {
        req.status(500).send({ error: err })
    }
});

app.post('/getMedals', async (req, res) => {
    try {
        const url = new URL(
            `https://osekai.net/medals/api/medals.php`
        );
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        const response = await fetch(url, {
            method: "POST",
            headers,
        });
        const data = await response.json();
        res.send(data);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

app.post('/users', async (req, res) => {
    const mode = req.body.mode;
    const type = req.body.type;
    const page = req.body.page;
    const object = {
        cursor: {
            page: page,
        },
        filter: 'all',       
    };
    const data = await v2.site.ranking.details(mode, type, object);
    res.send(data);
});

app.post('/user', async (req, res) => {
    try {
        const user_id = req.body.id;
        const mode = req.body.mode;
        let data;
        if (mode === 'default') {
            data = await v2.user.details(user_id);
        } else {
            data = await v2.user.details(user_id, mode);
        }
        data.db_info = await updateUser(data.id, data.username, data.rank_history?.data, data.statistics.country_rank, mode);
        
        // catalans
        data.customBadges = {};
        if ([17018032, 17897192, 20661304].includes(data.id)) {
            data.country.code = "CAT";
            data.country.name = "Catalunya";
        }
        // developers
        if ([17018032].includes(data.id)) {
            data.customBadges.developer = true;
        }
        // translators
        if ([17018032, 17524565, 12941954, 7161345, 14623152, 18674051, 17517577, 20405189, 13431764, 26688450, 9211305, 15165858, 14284545, 7424967, 8685250, 9552883, 12526902, 15525103, 16147953].includes(data.id)) {
            data.customBadges.translator = true;
        }
        res.send(data);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});


app.post('/beatmaps', async (req, res) => {
    try {
        let queryData = {
            query: req.body.query,
            filter: req.body.filter,
            mode: req.body.mode,
            ranked: req.body.status,
            limit: req.body.limit,
            offset: req.body.offset,
            sort: req.body.sort,
        }
        const data = await mino.v2.search(queryData);
        res.send(data);
    } catch (err) {
        res.status(500).send({ error: err });
    }
})

// app.post('/beatmapset', async (req, res) => {
//
// });

app.listen(port, () => {
    console.log(`App running in port ${port}`);
});

async function updateUser(userId, username, userRanks, countryRank, mode) {
    if (countryRank && userRanks) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const objectRanks = userRanks.map((number, index) => {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - (userRanks.length - 1 - index));
            return { rank: number, date };
        });
        const currentCountryRank = {
            date: currentDate,
            rank: countryRank
        }
        try {
            let response = {};
            if (await User.exists({ userId: userId })) {
                const user = await User.findOne({ userId: userId });
                user.username = username;
                await pushOrReplaceObjects(user.modes[mode].rankHistory, objectRanks);
                await pushOrReplaceObjects(user.modes[mode].countryRankHistory, [currentCountryRank]);
                user.modes[mode].rankHistory.sort((a, b) => a.date - b.date);
                user.modes[mode].countryRankHistory.sort((a, b) => a.date - b.date);
                response.global_rank = user.modes[mode].rankHistory;
                response.country_rank = user.modes[mode].countryRankHistory;
                if (user.setup) {
                    response.setup = user.setup;
                }
                await user.save();
            } else {
                switch (mode) {
                    case 'osu':
                        const userOsu = new User(
                            {
                                userId: userId,
                                username: username,
                                modes: {
                                    osu: {
                                        rankHistory: objectRanks,
                                        countryRankHistory: [currentCountryRank]
                                    }
                                }
                            }
                        )
                        await userOsu.save();
                        response.global_rank = userOsu.modes.osu.rankHistory;
                        response.country_rank = userOsu.modes.osu.countryRankHistory;
                        break;
                    case 'taiko':
                        const userTaiko = new User(
                            {
                                userId: userId,
                                username: username,
                                modes: {
                                    taiko: {
                                        rankHistory: objectRanks,
                                        countryRankHistory: [currentCountryRank]
                                    }
                                }
                            }
                        )
                        await userTaiko.save();
                        response.global_rank = userTaiko.modes.taiko.rankHistory;
                        response.country_rank = userTaiko.modes.taiko.countryRankHistory;
                        break;
                    case 'fruits':
                        const userFruits = new User(
                            {
                                userId: userId,
                                username: username,
                                modes: {
                                    fruits: {
                                        rankHistory: objectRanks,
                                        countryRankHistory: [currentCountryRank]
                                    }
                                }
                            }
                        )
                        await userFruits.save();
                        response.global_rank = userFruits.modes.fruits.rankHistory;
                        response.country_rank = userFruits.modes.fruits.countryRankHistory;
                        break;
                    case 'mania':
                        const userMania = new User(
                            {
                                userId: userId,
                                username: username,
                                modes: {
                                    mania: {
                                        rankHistory: objectRanks,
                                        countryRankHistory: [currentCountryRank]
                                    }
                                }
                            }
                        )
                        await userMania.save();
                        response.global_rank = userMania.modes.mania.rankHistory;
                        response.country_rank = userMania.modes.mania.countryRankHistory;
                        break;
                }
            }
            return response;
        } catch
        (e) {
            return [];
        }
    } else {
        return {
            "global_rank": [],
            "country_rank": []
        }
    }
}