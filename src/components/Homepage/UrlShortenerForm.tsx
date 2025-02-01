"use client";

import React, { useCallback } from "react";
import { useUrlContext } from "@/context/GlobalContext";
import { CheckIcon, CopyIcon, Loading, Scissors } from "@components/util/Icons";
import { AdvancedOptions } from "@components/links/Options";
import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";
import { toClipboard } from "copee";
import { AdvancedOptionsStruct } from "@interfaces";

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
    },
};

export const UrlShortenerForm: React.FC = () => {
    const [formState, setFormState] =
        React.useState<FormState>(initialFormState);
    const { addUrl } = useUrlContext();

    const resetError = useCallback(() => {
        setFormState((prev) => ({ ...prev, uploadError: false }));
    }, []);

    const shortenUrl = async () => {
        if (!formState.inputLink) {
            setFormState((prev) => ({
                ...prev,
                uploadError: "Please enter a URL",
            }));
            return;
        }

        setFormState((prev) => ({ ...prev, loading: true }));

        try {
            const response = await fetch("/api/url/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    longUrl: formState.inputLink,
                    ...(formState.advancedOptions.customAddress && {
                        customBackHalf: formState.advancedOptions.customAddress,
                    }),
                    ...(formState.advancedOptions.expiration && {
                        expirationDate: formState.advancedOptions.expiration,
                    }),
                    ...(formState.advancedOptions.urlLength && {
                        length: formState.advancedOptions.urlLength,
                    }),
                    ...(formState.advancedOptions.message && {
                        message: formState.advancedOptions.message,
                    }),
                    ...(formState.advancedOptions.password && {
                        password: formState.advancedOptions.password,
                    }),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to shorten URL");
            }

            const data = await response.json();
            setFormState((prev) => ({
                ...prev,
                shortUrl: data.shortId,
                loading: false,
                uploadError: false,
            }));
            addUrl(
                formState.inputLink,
                formState.advancedOptions.password,
                formState.advancedOptions.expiration,
                formState.advancedOptions.urlLength,
                formState.advancedOptions.message,
                data.shortId
            );
        } catch (error: any) {
            setFormState((prev) => ({
                ...prev,
                loading: false,
                uploadError: error.message || "Failed to shorten URL",
            }));
        }
    };

    return (
        <div>
            <h1 className="pb-5 pt-8 text-center text-3xl md:pt-10 md:text-[2.4rem]">
                <span className="block sm:inline">Make your links </span>
                <span className="block underline sm:inline">short</span>
            </h1>
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
                        onChange={(e) =>
                            setFormState((prev) => ({
                                ...prev,
                                inputLink: e.target.value,
                            }))
                        }
                        onClick={() =>
                            setFormState((prev) => ({
                                ...prev,
                                uploadError: false,
                            }))
                        }
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
                                setFormState((prev) => ({
                                    ...prev,
                                    copySuccess: true,
                                }));
                            }
                        }}>
                        {formState.copySuccess ? <CheckIcon /> : <CopyIcon />}
                    </button>

                    <a
                        href={"/s/" + formState.shortUrl}
                        rel="noreferrer"
                        target="_blank">
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
            <div className="pl-2 pt-6 md:pl-0">
                <label className="hover:cursor-pointer">
                    <input
                        type="checkbox"
                        className="rounded-sm hover:cursor-pointer"
                        onChange={() =>setFormState((prev) => ({
                                      ...prev,
                                      showOptions: !formState.showOptions,
                                  }))
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
                        setFormState((prev) => ({
                            ...prev,
                            advancedOptions:
                                typeof newOptions === "function"
                                    ? newOptions(prev.advancedOptions)
                                    : newOptions,
                        }))
                    }
                />
            ) : (
                ""
            )}
        </div>
    );
};
