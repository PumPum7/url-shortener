import type { NextApiRequest, NextApiResponse } from "next";

const faunadb = require("faunadb"),
    q = faunadb.query;

interface URL {
    short: string;
    long: string;
    password: string;
}

export default async function getUrl(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const client = new faunadb.Client({
        secret: process.env.GO_FAUNA_SECRET_KEY_A,
    });

    try {
        const { url } = req.query;

        client
            .query(q.Get(q.Match(q.Index("url_short"), url)))
            .then((ret) => {
                const data: URL = ret.data;
                res.status(200);
                res.send({
                    short: data.short,
                    long: data.long,
                    // checks if the url is protected
                    protected: !!data.password,
                });
            })
            .catch((e) => {
                console.error(e);
                res.status(404);
                res.json({ error: e });
            });
    } catch (e) {
        res.status(400).json({ error: e });
    }
}
