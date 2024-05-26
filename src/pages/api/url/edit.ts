import type { NextApiRequest, NextApiResponse } from "next";

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const faunadb = require("faunadb");

const q = faunadb.query;

export default withApiAuthRequired(async function editUrl(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user } = await getSession(req, res);

    const client = new faunadb.Client({
        secret: process.env.GO_FAUNA_SECRET_KEY_A,
    });

    const urlShort: string = req.body.short;
    const password: string = req.body.password || "";
    const expiration: number = (req.body.expiration as number) || 0;
    const customAddress: string = req.body.customAddress || "";
    const message: string = req.body.message || "";
    const length: number = (req.body.length as number) || 0;

    let newUrl = "";
    if (customAddress) {
        newUrl = customAddress;
    } else if (length != urlShort.length) {
        newUrl = generateShortUrl(length);
    } else {
        newUrl = urlShort;
    }

    try {
        client
            .query(
                q.Update(
                    q.Select(
                        ["ref"],
                        q.Get(
                            q.Match(q.Index("user_url_ref"), [
                                urlShort,
                                user.sub,
                            ])
                        )
                    ),
                    {
                        data: {
                            password: password,
                            short: newUrl,
                            message: message,
                        },
                        ttl:
                            expiration > 0
                                ? q.TimeAdd(q.Now(), expiration, "hours")
                                : null,
                    }
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

// TODO: finish implementing the editing backend
