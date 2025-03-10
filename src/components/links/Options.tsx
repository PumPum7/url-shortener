"use client";

import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";
import { AdvancedOptionsStruct } from "@interfaces";

import React, { SetStateAction, useState } from "react";

export function AdvancedOptions({
    midScreenAdapted = true,
    advancedOptions,
    setAdvancedOptions,
}: {
    midScreenAdapted?: boolean;
    advancedOptions: AdvancedOptionsStruct;
    setAdvancedOptions: React.Dispatch<SetStateAction<AdvancedOptionsStruct>>;
}): React.ReactElement {
    return (
        <div className="content-center pl-4">
            <div
                className={`grid gap-4 grid-cols-2 pr-2 pt-6 ${
                    midScreenAdapted ? "md:grid-cols-3 md:pr-0" : ""
                }`}>
                <AdvancedOption
                    text="Password"
                    optionId="password"
                    inputPlaceholder="Password"
                    inputType="text"
                    className="col-span-2 md:col-span-1"
                    value={advancedOptions.password}
                    onChange={(e) =>
                        setAdvancedOptions({
                            ...advancedOptions,
                            password: e.target.value,
                        })
                    }
                />
                <AdvancedOption
                    text={`Link`}
                    optionId="customAddress"
                    inputPlaceholder="Custom Address"
                    inputType="text"
                    className="col-span-2 md:col-span-1"
                    value={advancedOptions.customAddress}
                    onChange={(e) =>
                        setAdvancedOptions({
                            ...advancedOptions,
                            customAddress: e.target.value,
                        })
                    }
                    check={(e) => !e.target.value.includes(" ")}
                    errorMsg="You can't add spaces."
                />
                <AdvancedOption
                    text="Expiration"
                    optionId="expiration"
                    inputPlaceholder="3 hours"
                    inputType="number"
                    value={advancedOptions.expiration}
                    onChange={(e) =>
                        setAdvancedOptions({
                            ...advancedOptions,
                            expiration: e.target.value,
                        })
                    }
                />
                <AdvancedOption
                    text="Length"
                    optionId="length"
                    inputPlaceholder="5"
                    inputType="number"
                    value={advancedOptions.urlLength}
                    onChange={(e) =>
                        setAdvancedOptions({
                            ...advancedOptions,
                            urlLength: e.target.value,
                        })
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
                    value={advancedOptions.message}
                    onChange={(e) =>
                        setAdvancedOptions({
                            ...advancedOptions,
                            message: e.target.value,
                        })
                    }
                    check={(e) => e.target.value.length <= 100}
                    errorMsg={
                        "The length of the message has to be under 100 characters"
                    }
                />
            </div>
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
    value?: string | number;
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
    value,
}: OptionProps): React.ReactElement {
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
                className="form-input"
                defaultValue={value || ""}
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
            {error && <p className="form-error">{errorMsg}</p>}
        </div>
    );
}

export const AdvancedOptionsPlaceholder = ({
    midScreenAdapted,
}: {
    midScreenAdapted: boolean;
}): React.ReactElement => {
    return (
        <div className="content-center pl-4">
            <div
                className={`grid gap-4 grid-cols-2 pr-2 pt-6 animate-pulse ${
                    midScreenAdapted ? "md:grid-cols-3 md:pr-0" : ""
                }`}>
                <AdvancedOptionPlaceholder
                    category={"Password"}
                    className="col-span-2 md:col-span-1"
                />
                <AdvancedOptionPlaceholder
                    category={`Link`}
                    className="col-span-2 md:col-span-1"
                />
                <AdvancedOptionPlaceholder category={"Expiration"} />
                <AdvancedOptionPlaceholder category={"Length"} />
                <AdvancedOptionPlaceholder
                    category={"Message"}
                    className="col-span-2"
                />
            </div>
        </div>
    );
};

export const AdvancedOptionPlaceholder = ({
    category,
    className = "",
}: {
    category: string;
    className?: string;
}): React.ReactElement => {
    return (
        <div className={`flex flex-col ${className}`}>
            <p className="text-lg font-semibold">{category}</p>
            <div className="h-8 bg-blue-400 rounded-full" />
        </div>
    );
};
