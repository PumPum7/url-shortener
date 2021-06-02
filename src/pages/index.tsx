import React, { useState, useEffect } from "react";

import Head from "next/head";

import { useUser } from "@auth0/nextjs-auth0";

import { Scissors, Loading } from "@components/Icons";
import { AdvancedOptions } from "@components/homepage/Options";

import { createShortURL } from "@functions/urlHandlers";

import { URL, AdvancedOptionsStruct } from "@interfaces";


const DUPLICATE_NAME = "instance not unique"

export default function Home() {
    const [inputLink, setInputLink] = useState<string>("");
    const [shortUrl, setShortUrl] = useState<string>("");
    const [uploadError, setUploadError] = useState<boolean | string>(false);
    const [loading, setLoading] = useState<boolean>(false);

    let advancedOptions: AdvancedOptionsStruct = {
        password: "",
        customAddress: "",
        expiration: 0,
        length: 5,
        message: ""
    }

    const { user } = useUser();

    useEffect(() => {
        setTimeout(() => {
            setUploadError(false);
        }, 20000);
    }, [uploadError]);

    useEffect(() => {
        advancedOptions = {
            password: "",
            customAddress: "",
            expiration: 0,
            length: 5,
            message: ""
        }
        // resets the value of every advanced option field -> causes weird behaviour otherwise
        Array.from(document.getElementsByClassName("advancedOptions")).forEach(
            inputField => inputField["value"] = ""
        )
    }, [shortUrl])

    const shortenUrl = async () => {
        if (!user) {
            setUploadError("You must be logged in to shorten urls!");
            return;
        }
        try {
            setLoading(true);
            if (
                inputLink.replaceAll(" ", "") === "" ||
                !inputLink.includes(".")
            ) {
                setLoading(false);
                setUploadError(true);
            } else {
                if (!inputLink.startsWith("http")) {
                    setUploadError(
                        "Make sure that the link starts with http or https!"
                    );
                    return;
                }
                const result = (await createShortURL(inputLink, advancedOptions.password, advancedOptions.expiration, advancedOptions.length, advancedOptions.message, advancedOptions.customAddress)) as URL;
                // handle specific errors (typescript doesnt like this)
                if ("error" in result) {
                    // @ts-ignore
                    if (result.error.message === DUPLICATE_NAME) {
                        setUploadError("This short url already exists! Please choose a different url or try again with a longer length.")
                    } else {
                        throw new Error()
                    }
                } else {
                    setShortUrl(result.short);
                }
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
            <div className="md:container">
                <h1 className="text-center text-3xl md:text-[2.4rem] pt-8 pb-5 md:pt-10">
                    Make your links <span className="underline">short</span>
                </h1>
                <div>
                    <form
                        className="flex pb-6"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await shortenUrl();
                        }}>
                        <div
                            className={`relative mt-6 mx-auto rounded-xl border-b-5 w-[calc(100%-1rem)] md:shadow-lg bg-white ${
                                uploadError ? "border-2 border-red-500" : ""
                            }`}>
                            <input
                                type="text"
                                placeholder="Paste your long URL"
                                className="w-full border-transparent bg-transparent rounded-xl selected pt-2"
                                onChange={(e) => setInputLink(e.target.value)}
                                onClick={() => setUploadError(false)}
                            />
                            {loading ? (
                                <>
                                    <Loading className="cursor-wait absolute inset-y-0 right-0 flex items-center px-2 rounded-xl text-purple-500" />
                                </>
                            ) : uploadError ? (
                                ""
                            ) : (
                                <>
                                    <Scissors
                                        onClick={async () => shortenUrl()}
                                        className="cursor-pointer absolute inset-y-0 right-2 top-px flex items-center px-2 rounded-xl hover:shadow-md text-gray-400 hover:text-purple-500 bg-white h-[90%] pt-1"
                                    />
                                </>
                            )}
                        </div>
                    </form>
                    {shortUrl !== "" ? (
                        <div className="text-center">
                            <p>
                                <a
                                    href={`${window.location.href}s/${shortUrl}`}
                                    target="_blank"
                                    rel="noreferrer">
                                    {window.location.href}s/{shortUrl}
                                </a>
                            </p>
                        </div>
                    ) : (
                        ""
                    )}
                    {uploadError ? (
                        <div className="text-center text-red-500 pb-3">
                            {typeof uploadError === "string" ? (
                                <p>{uploadError}</p>
                            ) : (
                                <p>
                                    An error occurred please try again! Make
                                    sure that the input URL was valid.
                                </p>
                            )}
                        </div>
                    ) : (
                        ""
                    )}
                    <AdvancedOptions advancedOptions={advancedOptions}/>
                </div>
            </div>
        </>
    );
}
