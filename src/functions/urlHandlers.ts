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
    try {
        const response = await fetch(`${FUNCTIONS_DOMAIN}/api/url/create`, {
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
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to create short URL");
        }

        return await response.json();
    } catch (err) {
        console.error(err);
        return err;
    }
};

export const getLongUrl = async ({
    shortUrl,
    headers,
    clientInfo,
}: {
    shortUrl: string;
    headers?: Headers;
    clientInfo?: {
        userAgent: string;
        referrer: string;
    };
}): Promise<any> => {
    try {
        const requestHeaders: HeadersInit = {};

        // If we have server headers, forward them
        if (headers) {
            // Forward important headers for tracking
            const userAgent = headers.get("user-agent");
            const referer = headers.get("referer");
            const forwardedFor = headers.get("x-forwarded-for");

            if (userAgent) requestHeaders["user-agent"] = userAgent;
            if (referer) requestHeaders["referer"] = referer;
            if (forwardedFor) requestHeaders["x-forwarded-for"] = forwardedFor;
        }

        // If we have client info (from client components), use that
        if (clientInfo) {
            if (clientInfo.userAgent)
                requestHeaders["user-agent"] = clientInfo.userAgent;
            if (clientInfo.referrer)
                requestHeaders["referer"] = clientInfo.referrer;
        }

        const response = await fetch(
            `${FUNCTIONS_DOMAIN}/api/url/${shortUrl}`,
            {
                headers: requestHeaders,
            }
        );

        if (!response.ok) {
            return undefined;
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return undefined;
    }
};

export const getUserUrls = async (
    amount: number = 10,
    skip: number = 0,
    search: string = ""
): Promise<any> => {
    try {
        const response = await fetch(
            `${FUNCTIONS_DOMAIN}/api/url/user?amount=${amount}&skip=${skip}&search=${search}`
        );
        if (!response.ok) {
            return undefined;
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return undefined;
    }
};

export const getUserUrl = async (shortUrl: string): Promise<any> => {
    try {
        const response = await fetch(
            `${FUNCTIONS_DOMAIN}/api/url/information?url=${shortUrl}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch URL information");
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const editUserUrl = async (
    short: string,
    password: string = "",
    customAddress: string = "",
    expiration: number = 0,
    length: number = 0,
    message: string = ""
): Promise<any> => {
    try {
        const response = await fetch(`${FUNCTIONS_DOMAIN}/api/url/edit`, {
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
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to edit URL");
        }

        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const deleteUrl = async (url: string) => {
    try {
        const response = await fetch(
            `${FUNCTIONS_DOMAIN}/api/url/delete?url=${url}`,
            {
                method: "DELETE",
            }
        );
        if (!response.ok) {
            return undefined;
        }
        return await response.json();
    } catch (e) {
        console.error(e);
        return undefined;
    }
};

export const checkPasswords = async (url: string, inputPassword: string) => {
    try {
        const response = await fetch(`${FUNCTIONS_DOMAIN}/api/url/password`, {
            method: "POST",
            body: JSON.stringify({
                url: url,
                password: inputPassword,
            }),
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            return undefined;
        }

        return await response.json();
    } catch (e) {
        console.error(e);
        return undefined;
    }
};
