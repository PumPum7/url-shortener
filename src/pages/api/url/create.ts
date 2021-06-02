import type { NextApiRequest, NextApiResponse } from "next";

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const faunadb = require("faunadb");

const q = faunadb.query;

export default withApiAuthRequired(async function createUrl(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user } = getSession(req, res);

    const client = new faunadb.Client({
        secret: process.env.GO_FAUNA_SECRET_KEY_A,
    });
    try {
        const url: string = req.body.long;
        if (!url.startsWith("http")) {
            res.status(404).send({ error: "invalid url provided" });
        }
        const password: string = req.body.password || "";
        const expiration: number = (req.body.expiration as number) || 0;
        const urlLength: number = (req.body.length as number) || 5;
        const customAddress: string = req.body.customAddress || ""
        client
            .query(
                q.Create(
                    q.Collection("urls"),
                    q.Object({
                        data: {
                            short: customAddress || generateShortUrl(urlLength), // add a handler for duplicates
                            long: url,
                            usage: 0,
                            password,
                            user: user.user_id,
                        },
                        // adds the set expiration time to the cooldown
                        ttl:
                            expiration > 0
                                ? q.TimeAdd(q.Now(), expiration, "hours")
                                : null,
                    })
                )
            )
            .then((ret) => {
                res.status(200);
                res.send(ret.data);
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

function generateShortUrl(length: number): string {
    const result = [];
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const characterLength = characters.length;
    for (let i = 0; i < length; i++) {
        result.push(
            characters.charAt(Math.floor(Math.random() * characterLength))
        );
    }
    return result.join("");
}
