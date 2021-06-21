import React, { useState, useEffect } from "react";

import Head from "next/head";

import { useUser } from "@auth0/nextjs-auth0";

import { Scissors, Loading } from "@components/util/Icons";
import { AdvancedOptions } from "@components/links/Options";
import { RecentLinks } from "@components/links/RecentLinks";

import { createShortURL } from "@functions/urlHandlers";

import { URL, AdvancedOptionsStruct } from "@interfaces";
import { Landingpage } from "@components/Homepage/Landing";

const DUPLICATE_NAME = "instance not unique";

export default function Home() {
    const [inputLink, setInputLink] = useState<string>("");
    const [shortUrl, setShortUrl] = useState<string>("");
    const [uploadError, setUploadError] = useState<boolean | string>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showOptionsError, setShowOptionsError] = useState<string>("");
    const [advancedOptions, setAdvancedOptions] =
        useState<AdvancedOptionsStruct>({
            customAddress: "",
            expiration: 0,
            urlLength: 5,
            message: "",
            password: "",
        });

    const { user } = useUser();

    useEffect(() => {
        setTimeout(() => {
            setUploadError(false);
        }, 20000);
    }, [uploadError]);

    useEffect(() => {
        setAdvancedOptions({
            password: "",
            customAddress: "",
            expiration: 0,
            urlLength: 5,
            message: "",
        });
        // resets the value of every advanced option field -> causes weird behaviour otherwise
        Array.from(document.getElementsByClassName("advancedOptions")).forEach(
            (inputField) => (inputField["value"] = "")
        );
    }, [shortUrl]);

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
                const result = (await createShortURL(
                    inputLink,
                    advancedOptions.password,
                    advancedOptions.expiration,
                    advancedOptions.urlLength,
                    advancedOptions.message,
                    advancedOptions.customAddress
                )) as URL;
                // handle specific errors (typescript doesnt like this)
                if ("error" in result) {
                    // @ts-ignore
                    if (result.error.message === DUPLICATE_NAME) {
                        setUploadError(
                            "This short url already exists! Please choose a different url or try again with a longer length."
                        );
                    } else {
                        throw new Error();
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
                <h1 className="pb-5 pt-8 text-center text-3xl md:pt-10 md:text-[2.4rem]">
                    <span className="block sm:inline">Make your links </span>
                    <span className="block underline sm:inline">short</span>
                </h1>
                <div>
                    <form
                        className="flex"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await shortenUrl();
                        }}>
                        <div
                            className={`relative mt-6 mx-auto rounded-xl border-b-5 w-[calc(100%-1rem)] md:shadow-lg bg-white ${
                                uploadError ? "border-2 border-red-500" : ""
                            }`}>
                            <input
                                type="url"
                                placeholder="Paste your long URL"
                                className="pt-2 w-full bg-transparent border-transparent rounded-xl selected"
                                onChange={(e) => setInputLink(e.target.value)}
                                onClick={() => setUploadError(false)}
                            />
                            {loading ? (
                                <>
                                    <Loading className="absolute inset-y-0 right-0 flex items-center px-2 text-purple-500 rounded-xl cursor-wait" />
                                </>
                            ) : uploadError ? (
                                ""
                            ) : (
                                <>
                                    <Scissors
                                        onClick={async () => shortenUrl()}
                                        className="absolute inset-y-0 right-2 top-px flex items-center pt-1 px-2 text-gray-400 hover:text-purple-500 bg-white rounded-xl hover:shadow-md cursor-pointer h-[90%]"
                                    />
                                </>
                            )}
                        </div>
                    </form>
                    {shortUrl !== "" ? (
                        <div className="pt-6 text-center overflow-hidden overflow-ellipsis">
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
                        <div className="pb-3 text-center text-red-500">
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
                    {user ? (
                        <>
                            <div className="pl-2 pt-6 md:pl-0">
                                <label className="hover:cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded hover:cursor-pointer"
                                        onChange={() =>
                                            user
                                                ? setShowOptions(!showOptions)
                                                : setShowOptionsError(
                                                      "You need to log in to view the advanced options!"
                                                  )
                                        }
                                    />
                                    <span className="pl-4">
                                        Show advanced options
                                    </span>
                                </label>
                            </div>
                            {showOptionsError ? (
                                <p className="text-red-600">
                                    {showOptionsError}
                                </p>
                            ) : (
                                ""
                            )}
                            {showOptions ? (
                                <AdvancedOptions
                                    advancedOptions={advancedOptions}
                                    setAdvancedOptions={setAdvancedOptions}
                                />
                            ) : (
                                ""
                            )}
                            <RecentLinks />
                        </>
                    ) : (
                        <Landingpage />
                    )}
                </div>
            </div>
        </>
    );
}

// TODO: fix the link showcase (maybe also include the svg button)
