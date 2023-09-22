import { fastify as f } from "fastify"
import mino from "beatsify"
import badges from "./constants/badges.js"
import "dotenv/config"
import mysql from "mysql-commands"
import { v2, auth } from "osu-api-extended"
import cors from "@fastify/cors"

(async () => {
    const database = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    })

    console.log("Connected to the database");

    const fastify = f({ logger: true });
    fastify.register(cors, {
        origin: "*"
    })

    await auth.login(process.env.CLIENT_ID, process.env.CLIENT_SECRET, ['public'])

    console.log("Logged into Application")

    setInterval(async () => {
        await auth.login(process.env.CLIENT_ID, process.env.CLIENT_SECRET, ['public'])
    }, 1000 * 60 * 60 * 24)

    fastify.post('/proxy', async (req, res) => await (await fetch(req.body.url)).json());

    fastify.post('/getMedals', async (req, res) => await (await fetch(`https://osekai.net/medals/api/medals.php`, { method: "POST" })).json());

    fastify.post('/userQuery', async (req, res) => await v2.site.search({
            mode: 'user',
            query: req.body.username,
            page: 0
        })
    );

    fastify.post('/user', async (req, res) => {
        const user_id = req.body.id;
        const mode = req.body.mode;
        const data = mode === 'default' ? await v2.user.details(user_id) : await v2.user.details(user_id, mode);
        data.db_info = await updateUser(data.id, data.username, data.rank_history?.data, data.statistics.country_rank, data.rank_history?.mode);
        // catalans
        data.customBadges = {};
        if (badges.catalan.includes(data.id)) {
            data.country.code = "CAT";
            data.country.name = "Catalunya";
        }
    
        // developers
        // translators
        for(let badge of ["developer", "translator"]) if (badges[badge].includes(data.id)) data.customBadges[badge] = true;

        return data;
    });

    fastify.post('/users', async (req, res) => {
        const mode = req.body.mode;
        const type = req.body.type;
        const page = req.body.page;
        const object = {
            cursor: {
                page: page,
            },
            filter: 'all',       
        };
        return await v2.site.ranking.details(mode, type, object);
    });

    fastify.post('/beatmapset', async (req, res) => await mino.v2.set(req.body.setId));

    fastify.post('/beatmapsets', async (req, res) => await mino.v2.search({
            query: req.body.query,
            filter: req.body.filter,
            mode: req.body.mode,
            ranked: req.body.status,
            limit: req.body.limit,
            offset: req.body.offset,
            sort: req.body.sort,
       })
    )
    
    async function updateUser(userId, username, userRanks, countryRank, mode) {
        const response = {
            global_rank: [],
            country_rank: []
        }
    
        const time = new Date()
        time.setHours(0, 0, 0, 0)
    
        await database.insert("ranks", {
            object: {
                id: userId,
                time: time.getTime() / 1000,
                [mode]: countryRank,
                type: "country"
            },
            updateOnDuplicate: true
        })
    
       userRanks.map(async (number, index) => {
            const date = new Date(time)
           date.setDate(time.getDate() - (userRanks.length - 1 - index));
           await database.insert("ranks", {
                object: {
                    id: userId,
                    time: date.getTime() / 1000,
                    [mode]: number,
                    type: "global"
                },
                updateOnDuplicate: true
            })
       });
    
    
        await database.insert("users", {
            object: {
                id: userId,
                username: username
            },
            updateOnDuplicate: true
        })
    
        const ranks = await database.request(`
            SELECT r.time, r.${mode}, r.type
            FROM ranks r
            JOIN users u
            ON r.id = u.id
            WHERE r.id = ${userId}
            AND r.${mode} IS NOT NULL
        `)
    
        const globalRanks = new Array(...ranks).filter((v) => v.type == "global")
        const countryRanks = new Array(...ranks).filter((v) => v.type == "country")
    
        response.global_rank = globalRanks.map(val => ({ rank: val[mode], time: val.time }))
        response.country_rank = countryRanks.map(val => ({ rank: val[mode], time: val.time }))
    
        return response;
    }

    fastify.listen({ port: process.env.PORT })
})();