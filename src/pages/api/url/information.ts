import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

import faunadb from "faunadb";

const q = faunadb.query;

interface URL {
    short: string;
    long: string;
    password: string;
}

export default withApiAuthRequired(async function getUrlInformation(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user } = getSession(req, res);

    const client = new faunadb.Client({
        secret: process.env.GO_FAUNA_SECRET_KEY_A,
    });

    try {
        const { url } = req.query;

        client
            .query(q.Get(q.Match(q.Index("user_url"), [url, user.sub])))
            .then((result) => {
                res.status(200);
                res.send(result);
            })
            .catch((e) => {
                res.status(400);
                res.send({ error: e });
            });
    } catch (e) {
        res.status(400);
        res.send({ error: e });
    }
});
