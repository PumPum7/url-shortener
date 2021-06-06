const port = process.env.APP_PORT || 3000;
export const FUNCTIONS_DOMAIN =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    `http://localhost:${port}`;

export const createShortURL = async (
    longURL: string,
    password = "",
    expiration = 0,
    length = 5,
    message = "",
    customAddress = ""
): Promise<string | unknown> => {
    return await fetch(`${FUNCTIONS_DOMAIN}/api/url/create`, {
        method: "POST",
        body: JSON.stringify({
            long: longURL,
            password: password,
            expiration: expiration,
            length: length,
            message: message,
            customAddress: customAddress,
        }),
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .catch((err) => {
            console.error(err);
            return err;
        });
};

export const getLongUrl = async ({
    shortUrl,
}: {
    shortUrl: string;
}): Promise<any> => {
    return fetch(`${FUNCTIONS_DOMAIN}/api/url/${shortUrl}`)
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            }
            return undefined;
        })
        .catch((e) => console.error(e));
};

export const getUserUrls = async (
    amount: number = 10,
    skip: number = 0,
    search: string = ""
): Promise<any> => {
    return await fetch(
        `${FUNCTIONS_DOMAIN}/api/url/user?amount=${amount}&skip=${skip}&search=${search}`
    )
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            }
            return undefined;
        })
        .catch((e) => console.error(e));
};

export const getUserUrl = async (shortUrl: string): Promise<any> => {
    return await fetch(
        `${FUNCTIONS_DOMAIN}/api/url/information?url=${shortUrl}`
    ).then((res) => res.json());
};

export const editUserUrl = async (
    short: string,
    password: string = "",
    customAddress: string = "",
    expiration: number = 0,
    length: number = 0,
    message: string = ""
): Promise<any> => {
    return await fetch(`${FUNCTIONS_DOMAIN}/api/url/edit`, {
        method: "POST",
        body: JSON.stringify({
            short: short,
            password: password,
            customAddress: customAddress,
            expiration: expiration,
            length: length,
            message: message,
        }),
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .catch((err) => {
            console.error(err);
            return err;
        });
};
