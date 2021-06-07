import { Fragment, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
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

export const EditLinkModal = ({
    shortUrl,
    closeFunc,
    isOpen,
}: {
    shortUrl: string;
    closeFunc: () => void;
    isOpen: boolean;
}): JSX.Element => {
    const [advancedOptions, setAdvancedOptions] =
        useState<AdvancedOptionsStruct>({
            customAddress: "",
            expiration: 0,
            urlLength: 5,
            message: "",
            password: "",
        });
    const [status, setStatus] = useState<"editing" | "loading">("editing");

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
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto transition-opacity"
                    onClose={closeFunc}>
                    <div className="px-4 min-h-screen text-center">
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block align-middle h-screen"
                            aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            <div className="inline-block align-middle my-8 p-6 max-w-md text-left bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="pb-2 text-gray-900 text-lg font-bold leading-6">
                                    Edit Link{" "}
                                </Dialog.Title>
                                <Dialog.Description as="p">
                                    Change the settings below to update the
                                    link:
                                    <br />
                                    <a
                                        className="link"
                                        href={`${FUNCTIONS_DOMAIN}/s/${shortUrl}`}>
                                        {FUNCTIONS_DOMAIN}/s/{shortUrl}
                                    </a>
                                </Dialog.Description>
                                {advancedOptions.customAddress !== "" ? (
                                    <div className="mt-2">
                                        <AdvancedOptions
                                            midScreenAdapted={false}
                                            advancedOptions={advancedOptions}
                                            setAdvancedOptions={
                                                setAdvancedOptions
                                            }
                                        />
                                    </div>
                                ) : (
                                    <AdvancedOptionsPlaceholder
                                        midScreenAdapted={false}
                                    />
                                )}
                                <div className="flex justify-around mt-4">
                                    <button
                                        type="button"
                                        className="justify-center px-4 py-2 text-blue-600 font-medium bg-gray-100 hover:bg-gray-200 border border-transparent rounded-md focus:outline-none focus-visible:outline-none hover:cursor-pointer focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-2"
                                        onClick={closeFunc}>
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md focus:outline-none focus-visible:outline-none disabled:opacity-50 hover:cursor-pointer hover:ring-blue-300 hover:ring-2"
                                        onClick={editLink}
                                        disabled={status !== "editing"}>
                                        Edit link
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

// TODO: improved error handling
// TODO: add loading
