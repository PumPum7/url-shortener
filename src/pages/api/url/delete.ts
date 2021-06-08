import type { NextApiRequest, NextApiResponse } from "next";

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const faunadb = require("faunadb");

const q = faunadb.query;

export default withApiAuthRequired(async function deleteUrl(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user } = getSession(req, res);

    const client = new faunadb.Client({
        secret: process.env.GO_FAUNA_SECRET_KEY_A,
    });

    const { url } = req.query;

    try {
        client
            .query(
                q.Delete(
                    q.Select(
                        ["ref"],
                        q.Get(q.Match(q.Index("user_url_ref"), [url, user.sub]))
                    )
                )
            )
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
