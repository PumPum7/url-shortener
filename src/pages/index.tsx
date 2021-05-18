import Head from "next/head";
import React, { useState, useEffect } from "react";

import { Scissors, Loading} from "@components/Icons"

import { createShortURL, FUNCTIONS_DOMAIN } from "@functions/urlHandlers";

import { URL } from "@interfaces";

export default function Home() {
    const [inputLink, setInputLink] = useState<string>("");
    const [shortUrl, setShortUrl] = useState<string>("");
    const [uploadError, setUploadError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            setUploadError(false)
        }, 5000)
    }, [uploadError])

    const shortenUrl = async () => {
        try {
            setLoading(true);
            if (inputLink.replaceAll(" ", "") === "" || !inputLink.includes(".")) {
                setLoading(false)
                setUploadError(true)
            } else {
                if (!inputLink.startsWith("http")) {
                    setInputLink("https://" + inputLink);
                }
                const result = (await createShortURL(
                    inputLink
                )) as URL;
                setShortUrl(result.short);
                setLoading(false);
            }
        } catch {
            setUploadError(true);
        }
    };

    return (
        <>
            <Head>
                <title>URL Shortener ✂️</title>
            </Head>
            <div className="container">
                <h1 className="text-center text-2xl pt-2">
                    Make your links <span className="underline">short</span>
                </h1>
                <div>
                    <form
                        className="flex pb-6"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await shortenUrl();
                        }}>
                        <div className="relative mt-6 mx-auto rounded-xl border-b-2 shadow-lg w-full">
                            <input
                                type="text"
                                placeholder="Paste your long URL"
                                className="w-full border-transparent bg-transparent rounded-xl"
                                onChange={(e) => setInputLink(e.target.value)}
                            />
                            {loading ? (
                                <>
                                    <Loading classNames="cursor-wait absolute inset-y-0 right-0 flex items-center px-2 rounded-xl text-purple-500" />
                                </>
                            ) : uploadError ? "" : (
                                <>
                                    <Scissors onClick={async () => await shortenUrl()}
                                    classNames="cursor-pointer absolute inset-y-0 right-0 flex items-center px-2 rounded-xl hover:shadow-md text-gray-400 hover:text-purple-500" 
                                    />
                                </>
                            )}
                        </div>
                    </form>
                    {shortUrl !== "" ? (
                        <div className="text-center">
                            <p>
                                <a
                                    href={FUNCTIONS_DOMAIN + "/s/" + shortUrl}
                                    target="_blank">
                                    {FUNCTIONS_DOMAIN}/s/{shortUrl}
                                </a>
                            </p>
                        </div>
                    ) : (
                        ""
                    )}
                    {uploadError ? (
                        <div className="text-center text-red-500">
                            <p>
                                An error occurred please try again! Make sure
                                that the input URL was valid.
                            </p>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </>
    );
}
