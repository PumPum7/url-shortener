import React, { Fragment, useEffect, useState } from "react";

import {
    Description,
    Dialog,
    DialogBackdrop,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import toast from "react-hot-toast";

import {
    AdvancedOptions,
    AdvancedOptionsPlaceholder,
} from "@components/links/Options";

import {
    getUserUrl,
    FUNCTIONS_DOMAIN,
    editUserUrl,
} from "@functions/urlHandlers";

import { AdvancedOptionsStruct } from "@interfaces";
import { useUrlContext } from "@/context/GlobalContext";

interface EditLinkModalProps {
    shortUrl: string;
    closeFunc: () => void;
    isOpen: boolean;
}

export const EditLinkModal: React.FC<EditLinkModalProps> = ({
    shortUrl,
    closeFunc,
    isOpen,
}) => {
    const [advancedOptions, setAdvancedOptions] =
        useState<AdvancedOptionsStruct>({
            customAddress: "",
            expiration: 0,
            urlLength: 5,
            message: "",
            password: "",
        });
    const [status, setStatus] = useState<"editing" | "loading">("editing");

    const { updateUrl } = useUrlContext();

    useEffect(() => {
        getUserUrl(shortUrl).then((response) => {
            let data = response.data;

            setAdvancedOptions({
                password: data.password || "",
                customAddress: data.short,
                expiration: response.tls,
                urlLength: data.short.length,
                message: data.message || "",
            });
        });
    }, []);

    const editLink = () => {
        setStatus("loading");
        const editLinkStatus = editUserUrl(
            shortUrl,
            advancedOptions.password,
            advancedOptions.customAddress,
            advancedOptions.expiration,
            advancedOptions.urlLength,
            advancedOptions.message
        );
        toast.promise(
            editLinkStatus,
            {
                loading: "Loading...",
                success: (response) => {
                    setStatus("editing");
                    updateUrl(shortUrl, response.data.short);
                    return `Successfully edited the link ${response.data.short}`;
                },
                error: () => "An error occurred while editing the link.",
            },
            {
                style: {
                    minWidth: "250px",
                },
                success: {
                    duration: 3000,
                    icon: "✔️",
                },
                error: {
                    duration: 3000,
                    icon: "❌",
                },
                id: "editLinkToast",
            }
        );
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto transition-opacity"
                onClose={closeFunc}>
                <div className="px-4 min-h-screen text-center">
                    <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block align-middle h-screen"
                        aria-hidden="true">
                        &#8203;
                    </span>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95">
                        <div className="inline-block align-middle my-8 p-6 max-w-md text-left bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
                            <DialogTitle
                                as="h3"
                                className="pb-2 text-gray-900 text-lg font-bold leading-6">
                                Edit Link{" "}
                            </DialogTitle>
                            <Description as="p">
                                Change the settings below to update the link:
                                <br />
                                <a
                                    className="link"
                                    href={`${FUNCTIONS_DOMAIN}/s/${shortUrl}`}
                                    target="_blank"
                                    rel="noreferrer">
                                    {FUNCTIONS_DOMAIN}/s/{shortUrl}
                                </a>
                            </Description>
                            {advancedOptions.customAddress === "" ? (
                                <AdvancedOptionsPlaceholder
                                    midScreenAdapted={true}
                                />
                            ) : (
                                <div className="mt-2">
                                    <AdvancedOptions
                                        midScreenAdapted={false}
                                        advancedOptions={advancedOptions}
                                        setAdvancedOptions={setAdvancedOptions}
                                    />
                                </div>
                            )}
                            <div className="flex justify-around mt-4">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={closeFunc}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="form-button"
                                    onClick={editLink}
                                    disabled={status !== "editing"}>
                                    Edit link
                                </button>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};
