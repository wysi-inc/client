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
})

app.get('/proxy/:url', async (req, res) => {
    const url = decodeURIComponent(req.params.url);
    axios.get(url)
        .then(response =>
            res.send(response.data))
        .catch(error =>
            res.status(500).send({error: error.toString()})
        );
})

const main = async () => {
    // Auth via client
    await auth.login(client_id, client_secret, ['public'])
}
main().then();

// app.post('/ppTools', async (req, res) => {
//     const id = req.body.id;
//     const mods = req.body.mods;
//     const max_combo = req.body.combo;
//     const acc = req.body.acc;
//     const data = await tools.pp.calculate(id, mods, max_combo, 0, acc);
//     const response = {
//         new_stats: {
//             difficulty: data?.stats?.star?.pure,
//             ar: data?.stats?.ar,
//             od: data?.stats?.od,
//             cs: data?.stats?.cs,
//             hp: data?.stats?.hp,
//             bpm: data?.stats?.bpm?.api,
//             time: data?.stats?.time?.drain,
//         },
//         pp_current: data?.pp?.current,
//         pp_fc: data?.pp?.fc,
//         name: data?.data?.title,
//     }
//     res.send(response)
// })

app.get('/user/:id/:mode', async (req, res) => {
    const user_id = req.params.id;
    const mode = req.params.mode;
    const data = await v2.user.details(user_id, mode);
    res.send(data);
})

app.get('/getMedals', async function (req, res) {
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
    } catch (error) {
        res.status(500).send({error: error.toString()})
    }
});


app.listen(port, () => {
    console.log(`App running in port ${port}`)
})