import { URL } from "@interfaces"

export const FUNCTIONS_DOMAIN = process.env.NODE_ENV !== "production" ? "http://localhost:3000" : process.env.VERCEL_URL

export const createShortURL = async (
    longURL: string): Promise<object> => {
    return await fetch(`${FUNCTIONS_DOMAIN}/api/createUrl`, {
        method: "POST",
        body: JSON.stringify({
            long: longURL,
            headers: { "Content-Type": "application/json" },
        }),
    })
        .then((res) => res.json())
        .catch((err) => { console.error(err)});
};

export const getLongUrl = async ({shortUrl}: {shortUrl: string}): Promise<any> => {
    return await fetch(`${FUNCTIONS_DOMAIN}/api/getUrl?url=${shortUrl}`)
        .then((res) => res.json())
        .catch((e) => console.error(e));
}