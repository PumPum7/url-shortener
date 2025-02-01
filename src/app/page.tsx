'use client';

import React, { useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Scissors, Loading, CheckIcon, CopyIcon } from "@components/util/Icons";
import { AdvancedOptions } from "@components/links/Options";
import { RecentLinks } from "@components/links/RecentLinks";
import { Landingpage } from "@components/Homepage/Landing";
import { useUrlStore } from "@functions/globalZustand";
import { URL, AdvancedOptionsStruct } from "@interfaces";
import { toClipboard } from "copee";
import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

// State types
interface FormState {
    loading: boolean;
    copySuccess: boolean;
    showOptions: boolean;
    uploadError: boolean | string;
    inputLink: string;
    shortUrl: string;
    showOptionsError: string;
    advancedOptions: AdvancedOptionsStruct;
}

// Initial state
const initialFormState: FormState = {
    loading: false,
    copySuccess: false,
    showOptions: false,
    uploadError: false,
    inputLink: "",
    shortUrl: "",
    showOptionsError: "",
    advancedOptions: {
        customAddress: "",
        expiration: 0,
        urlLength: 5,
        message: "",
        password: "",
    }
};

export default withPageAuthRequired(function Home() {
    const [formState, setFormState] = React.useState<FormState>(initialFormState);
    const { user } = useUser();
    const addUrl = useUrlStore(state => state.addUrl);

    const resetError = useCallback(() => {
        if (formState.uploadError) {
            const timer = setTimeout(() => {
                setFormState(prev => ({ ...prev, uploadError: false }));
            }, 20000);
            return () => clearTimeout(timer);
        }
    }, [formState.uploadError]);

    const resetAdvancedOptions = useCallback(() => {
        if (formState.shortUrl) {
            setFormState(prev => ({
                ...prev,
                advancedOptions: initialFormState.advancedOptions
            }));
            Array.from(document.getElementsByClassName("advancedOptions")).forEach(
                (inputField) => ((inputField as HTMLInputElement).value = "")
            );
        }
    }, [formState.shortUrl]);

    React.useEffect(() => {
        resetError();
    }, [resetError]);

    React.useEffect(() => {
        resetAdvancedOptions();
    }, [resetAdvancedOptions]);

    const shortenUrl = async () => {
        if (!user) {
            setFormState(prev => ({ ...prev, uploadError: "You must be logged in to shorten urls!" }));
            return;
        }
        try {
            setFormState(prev => ({ ...prev, loading: true }));
            if (formState.inputLink.replaceAll(" ", "") === "" || !formState.inputLink.includes(".")) {
                setFormState(prev => ({ ...prev, loading: false, uploadError: true }));
            } else {
                if (!formState.inputLink.startsWith("http")) {
                    setFormState(prev => ({ ...prev, uploadError: "Make sure that the link starts with http or https!" }));
                    return;
                }
                const result = (await addUrl(
                    formState.inputLink,
                    formState.advancedOptions.password,
                    formState.advancedOptions.expiration,
                    formState.advancedOptions.urlLength,
                    formState.advancedOptions.message,
                    formState.advancedOptions.customAddress
                )) as URL;

                if ("error" in result) {
                    if (result.error.message === "instance not unique") {
                        setFormState(prev => ({ ...prev, uploadError: "This short url already exists! Please choose a different url or try again with a longer length." }));
                    } else {
                        throw new Error();
                    }
                } else {
                    setFormState(prev => ({ ...prev, shortUrl: result.short }));
                }
                setFormState(prev => ({ ...prev, loading: false }));
            }
        } catch {
            setFormState(prev => ({ ...prev, uploadError: true }));
        }
    };

    return (
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
                            formState.uploadError ? "border-2 border-red-500" : ""
                        }`}>
                        <input
                            type="url"
                            placeholder="Paste your long URL"
                            className="pt-2 w-full bg-transparent border-transparent rounded-xl selected"
                            onChange={(e) => setFormState(prev => ({ ...prev, inputLink: e.target.value }))}
                            onClick={() => setFormState(prev => ({ ...prev, uploadError: false }))}
                        />
                        {formState.loading ? (
                            <Loading className="absolute inset-y-0 right-0 flex items-center px-2 text-purple-500 rounded-xl cursor-wait" />
                        ) : formState.uploadError ? (
                            ""
                        ) : (
                            <Scissors
                                onClick={async () => await shortenUrl()}
                                className="absolute inset-y-0 right-2 top-px flex items-center pt-1 px-2 text-gray-400 hover:text-purple-500 bg-white rounded-xl hover:shadow-md cursor-pointer h-[90%]"
                            />
                        )}
                    </div>
                </form>
                {formState.shortUrl !== "" ? (
                    <div className="flex items-center justify-center pt-6 text-sm link">
                        <button
                            className={`text-green-600 bg-green-100 ring-green-50 action-icon ${
                                !formState.copySuccess ? "active" : ""
                            }`}
                            onClick={() => {
                                const success = toClipboard(
                                    `${FUNCTIONS_DOMAIN}/s/${formState.shortUrl}`
                                );
                                if (success) {
                                    setFormState(prev => ({ ...prev, copySuccess: true }));
                                }
                            }}>
                            {formState.copySuccess ? <CheckIcon /> : <CopyIcon />}
                        </button>

                        <a href={"/s/" + formState.shortUrl} rel="noreferrer" target="_blank">
                            {FUNCTIONS_DOMAIN.replace("http://", "").replace(
                                "https://",
                                ""
                            )}
                            /s/{formState.shortUrl}
                        </a>
                    </div>
                ) : (
                    ""
                )}
                {formState.uploadError ? (
                    <div className="pb-3 text-center text-red-500">
                        {typeof formState.uploadError === "string" ? (
                            <p>{formState.uploadError}</p>
                        ) : (
                            <p>
                                An error occurred please try again! Make sure that
                                the input URL was valid.
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
                                    className="rounded-sm hover:cursor-pointer"
                                    onChange={() =>
                                        user
                                            ? setFormState(prev => ({ ...prev, showOptions: !formState.showOptions }))
                                            : setFormState(prev => ({ ...prev, showOptionsError: "You need to log in to view the advanced options!" }))
                                    }
                                />
                                <span className="pl-4">Show advanced options</span>
                            </label>
                        </div>
                        {formState.showOptionsError ? (
                            <p className="text-red-600">{formState.showOptionsError}</p>
                        ) : (
                            ""
                        )}
                        {formState.showOptions ? (
                            <AdvancedOptions
                                advancedOptions={formState.advancedOptions}
                                setAdvancedOptions={(newOptions) => 
                                    setFormState(prev => ({
                                        ...prev,
                                        advancedOptions: typeof newOptions === 'function' 
                                            ? newOptions(prev.advancedOptions)
                                            : newOptions
                                    }))
                                }
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
    );
})
