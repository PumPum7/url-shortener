import React, { useEffect, useState } from "react";

import { useUser } from "@auth0/nextjs-auth0";

import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";

import { AdvancedOptionsStruct } from "@interfaces";

export function AdvancedOptions({
    advancedOptions,
}: {
    advancedOptions: AdvancedOptionsStruct;
}): JSX.Element {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!showOptions) {
            advancedOptions.password = "";
            advancedOptions.message = "";
            advancedOptions.length = 5;
            advancedOptions.expiration = 0;
            advancedOptions.customAddress = "";
        }
    }, [showOptions]);

    const { user } = useUser();

    return (
        <div className="content-center pl-4 pt-6">
            <label className="hover:cursor-pointer">
                <input
                    type="checkbox"
                    className="rounded"
                    onChange={() =>
                        user
                            ? setShowOptions(!showOptions)
                            : setError(
                                  "You need to log in to view the advanced options!"
                              )
                    }
                />
                <span className="pl-4">Show advanced options</span>
            </label>
            {error && <div className="pt-4 text-red-600">{error}</div>}
            {showOptions ? (
                <div className="grid gap-4 grid-cols-2 pr-2 pt-6 md:grid-cols-3 md:pr-0">
                    <AdvancedOption
                        text="Password"
                        optionId="password"
                        inputPlaceholder="Password"
                        inputType="text"
                        className="col-span-2 md:col-span-1"
                        onChange={(e) =>
                            (advancedOptions.password = e.target.value)
                        }
                    />
                    <AdvancedOption
                        text={`${FUNCTIONS_DOMAIN}/`}
                        optionId="customAddress"
                        inputPlaceholder="Custom Address"
                        inputType="text"
                        className="col-span-2 md:col-span-1"
                        onChange={(e) =>
                            (advancedOptions.customAddress = e.target.value)
                        }
                    />
                    <AdvancedOption
                        text="Expiration"
                        optionId="expiration"
                        inputPlaceholder="3 hours"
                        inputType="number"
                        onChange={(e) =>
                            (advancedOptions.expiration = e.target.value)
                        }
                    />
                    <AdvancedOption
                        text="Length"
                        optionId="length"
                        inputPlaceholder="5"
                        inputType="number"
                        onChange={(e) =>
                            (advancedOptions.length = e.target.value)
                        }
                        check={(e) =>
                            (e.target.value >= 5 && e.target.value <= 100) ||
                            e.target.value.length === 0
                        }
                        errorMsg="The length must be between 5 and 100"
                    />
                    <AdvancedOption
                        text="Message"
                        optionId="message"
                        className="col-span-2"
                        inputPlaceholder="Message"
                        inputType="text"
                        onChange={(e) =>
                            (advancedOptions.message = e.target.value)
                        }
                        check={(e) => e.target.value.length <= 100}
                        errorMsg={
                            "The length of the message has to be under 100 characters"
                        }
                    />
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

interface OptionProps {
    text: string;
    optionId: string;
    inputPlaceholder: string;
    inputType: string;
    className?: string;
    onChange: (e) => void;
    check?: (e) => boolean;
    errorMsg?: string;
}

export function AdvancedOption({
    text,
    optionId,
    inputPlaceholder,
    inputType,
    className = "",
    onChange,
    check,
    errorMsg,
}: OptionProps): JSX.Element {
    const [error, setError] = useState<boolean>(false);

    return (
        <div className={`flex flex-col ${className}`}>
            <label htmlFor={optionId} className="text-lg font-semibold">
                {text}
            </label>
            <input
                id={optionId}
                placeholder={inputPlaceholder}
                type={inputType}
                className="rounded-md advancedOptions"
                onChange={(e) => {
                    onChange(e);
                    if (check) {
                        if (!check(e)) {
                            setError(true);
                        } else {
                            setError(false);
                        }
                    }
                }}
            />
            {error && <p className="text-red-600">{errorMsg}</p>}
        </div>
    );
}
