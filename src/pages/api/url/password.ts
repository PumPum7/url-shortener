import type { NextApiRequest, NextApiResponse } from "next";

import faunadb from "faunadb";

const q = faunadb.query;

export default async function confirmPassword(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const client = new faunadb.Client({
        secret: process.env.GO_FAUNA_SECRET_KEY_A,
    });

    try {
        const url = req.body.url;
        const password = req.body.password;

        client
            .query(q.Get(q.Match(q.Index("url_short"), url)))
            .then((ret) => {
                // @ts-ignore
                const { data }: { data: URL } = ret;
                res.status(200);
                res.send({
                    confirmed: data.password === password,
                });
            })
            .catch((e) => {
                res.status(404);
                res.send({ error: e });
            });
    } catch (e) {
        res.status(400);
        res.send({ error: e });
    }
}
