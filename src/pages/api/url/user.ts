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

    let { amount, skip, search } = req.query;

    try {
        // Paginate then map get through them
        await client
            .query(
                q.Paginate(q.Match(q.Index("user_id"), user.sub), {
                    // The type insertion is mainly a workaround against IDE complaints
                    size: parseInt(<string>amount),
                })
            )
            ///
            .then(async (result) => {
                res.status(200);
                let totalLinks = 0;
                await getUrlCount(client, q, user.sub).then(
                    (urlCount) => (totalLinks = urlCount)
                );
                let recentLinks = [];
                result.data
                    .slice(
                        skip,
                        parseInt(<string>skip) + parseInt(<string>amount)
                    )
                    .forEach((link) => {
                        // checks if the long or short url contains the searched string
                        if (search) {
                            if (
                                !link[1].includes(search) &&
                                !link[2].includes(search)
                            ) {
                                return;
                            }
                        }
                        recentLinks.push({
                            ref: link[0],
                            long: link[1],
                            short: link[2],
                            usage: link[3],
                            // Used to convert microseconds to milliseconds
                            timeStamp: link[4] / 1000,
                        });
                    });
                res.send({ links: recentLinks, total: totalLinks });
            });
    } catch (err) {
        res.status(400);
        res.send({ error: err });
    }
});

const getUrlCount = async (
    client: any,
    q: any,
    user: string
): Promise<number> => {
    return await client
        .query(
            q.Count(q.Paginate(q.Match(q.Index("user"), user), { size: 10000 }))
        )
        .then((res) => {
            return res.data[0] as number;
        })
        .catch((e) => {
            console.error(e);
            return 0;
        });
};
