import Head from "next/head";
import React, { useState, useEffect } from "react";

import { createShortURL } from "@functions/urlHandlers";

import { URL } from "@interfaces";

export default function Home() {
    const [inputLink, setInputLink] = useState<string>("");
    const [shortUrl, setShortUrl] = useState<string>("");
    const [uploadError, setUploadError] = useState<boolean>(false);

    const shortenUrl = async () => {
        try {
            const result = (await createShortURL(inputLink)) as URL;
            setShortUrl(result.short);
        } catch {
            setUploadError(true);
        }
    };

    useEffect(() => {
        console.log(shortUrl);
    }, [shortUrl]);

    return (
        <>
            <Head>
                <title>URL Shortener ✂️</title>
            </Head>
            <div className="container">
                <h1 className="text-center text-2xl pt-2">
                    Shorten your domains
                </h1>
                <div>
                    <form className="flex pb-6">
                        <div className="mx-auto relative w-64 pt-6">
                            <input
                                type="text"
                                placeholder="Paste your long URL"
                                className="mx-auto rounded-xl shadow-lg w-full"
                                onChange={(e) => setInputLink(e.target.value)}
                            />
                            <div
                                className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pt-6 hover:shadow-md"
                                onClick={async (e) => await shortenUrl()}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42a3.5 3.5 0 101.414 1.414l8.128-8.127a1 1 0 00-1.414-1.414L10 8.586l-1.42-1.42A3.5 3.5 0 005.5 2zM4 5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 9a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                                        clipRule="evenodd"
                                    />
                                    <path d="M12.828 11.414a1 1 0 00-1.414 1.414l3.879 3.88a1 1 0 001.414-1.415l-3.879-3.879z" />
                                </svg>
                            </div>
                        </div>
                    </form>
                    {shortUrl !== "" ? (
                        <div className="text-center">
                            <p>{shortUrl}</p>
                        </div>
                    ) : (
                        ""
                    )}
                    {uploadError ? (
                        <div className="text-center text-red-500">
                            <p>An error occurred please try again!</p>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </>
    );
}
