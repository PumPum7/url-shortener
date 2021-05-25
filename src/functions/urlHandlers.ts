const port = process.env.APP_PORT || 3000;
const FUNCTIONS_DOMAIN =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    `http://localhost:${port}`;

export const createShortURL = async (longURL: string): Promise<object> => {
    return await fetch(`${FUNCTIONS_DOMAIN}/api/createUrl`, {
        method: "POST",
        body: JSON.stringify({
            long: longURL,
            headers: { "Content-Type": "application/json" },
        }),
    })
        .then((res) => res.json())
        .catch((err) => {
            console.error(err);
        });
};

export const getLongUrl = async ({
    shortUrl,
}: {
    shortUrl: string;
}): Promise<any> => {
    return await fetch(`${FUNCTIONS_DOMAIN}/api/getUrl?url=${shortUrl}`)
        .then((res) => res.json())
        .catch((e) => console.error(e));
};

export const deleteShortURL = async (shortURL: string): Promise<object> => {
    return await fetch(`${FUNCTIONS_DOMAIN}/api/deleteUrl`, {
        method: "DELETE",
        body: JSON.stringify({
            short: shortURL,
            headers: { "Content-Type": "application/json" },
        }),
    })
        .then((res) => res.json())
        .catch((err) => console.error(err));
};
