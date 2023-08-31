const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser'); // Require body-parser
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const port = 5000;
const {v2, auth, tools} = require('osu-api-extended');
const client_id = 22795;
const client_secret = '1hpA9sk7wzAewt62ePe592FWnFbGoRqAolRBi2RE';
//const callback_url = 'http://localhost:3000'
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/proxy/', async (req, res) => {
    const url = req.body.url;
    axios.get(url)
        .then(response =>
            res.send(response.data))
        .catch(error =>
            res.status(500).send({error: error.toString()})
        );
});

const main = async () => {
    await auth.login(client_id, client_secret, ['public'])
}
main().then(() => console.log('connected'));

app.post('/user', async (req, res) => {
    const user_id = req.body.id;
    const mode = req.body.mode;
    if (mode === 'default') {
        const data = await v2.user.details(user_id);
        res.send(data);
    } else {
        const data = await v2.user.details(user_id, mode);
        res.send(data);
    }
});

app.post('/getMedals', async (req, res) => {
    try {
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
        } catch (error) {
            res.status(500).send({error: error.toString()});
        }
    } catch (e) {
        res.status(500).send({error: e.toString()})
    }
});

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
    } catch (e) {
        console.error(e);
        req.status(500).send({error: e.toString()})
    }
});

app.post('/beatmaps', async (req, res) => {
    let queryData = {
        query: req.body.query,
        section: req.body.section,
        nsfw: true,
    }
    if (req.body.mode !== 'any') {
        queryData.mode = req.body.mode;
    }
    if (req.body.genre !== 'any') {
        queryData.genre = req.body.genre;
    }
    if (req.body.language !== 'any') {
        queryData.language = req.body.language;
    }
    console.log(queryData)
    const data = await v2.beatmaps.search(queryData);
    res.send(data);
})


app.listen(port, () => {
    console.log(`App running in port ${port}`)
});