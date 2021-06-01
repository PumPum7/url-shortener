const port = process.env.APP_PORT || 3000;
export const FUNCTIONS_DOMAIN =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    `http://localhost:${port}`;

export const createShortURL = async (
    longURL: string,
    password: string = "",
    expiration: number = 0,
    length: number = 5
): Promise<object> => {
    return await fetch(`/api/url/create`, {
        method: "POST",
        body: JSON.stringify({
            long: longURL,
            password: password,
            expiration: expiration,
            length: length,
        }),
        headers: { "Content-Type": "application/json" },
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
    return fetch(`${FUNCTIONS_DOMAIN}/api/url/${shortUrl}`)
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                return undefined;
            }
        })
        .catch((e) => console.error(e));
};

export const deleteShortURL = async (shortURL: string): Promise<object> => {
    return await fetch(`/api/deleteUrl`, {
        method: "DELETE",
        body: JSON.stringify({
            short: shortURL,
            headers: { "Content-Type": "application/json" },
        }),
    })
        .then((res) => res.json())
        .catch((err) => console.error(err));
};
