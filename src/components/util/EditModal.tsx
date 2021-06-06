import { Fragment, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";

import { AdvancedOptions } from "@components/links/Options";

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
            length: 5,
            message: "",
            password: "",
        });
    const [status, setStatus] =
        useState<"editing" | "loading" | "success">("editing");

    useEffect(() => {
        getUserUrl(shortUrl).then((response) => {
            let data = response.data;

            setAdvancedOptions({
                password: data.password || "",
                customAddress: data.short,
                expiration: response.tls,
                length: shortUrl.length,
                message: data.message || "",
            });
        });
    }, []);

    useEffect(() => {
        if (status === "success") {
            setTimeout(() => {
                setStatus("editing");
            }, 2000);
        }
    }, [status]);

    const editLink = () => {
        setStatus("loading");
        editUserUrl(
            shortUrl,
            advancedOptions.password,
            advancedOptions.customAddress,
            advancedOptions.expiration,
            advancedOptions.length,
            advancedOptions.message
        ).then(() => setStatus("success"));
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
                                    {advancedOptions.customAddress === shortUrl
                                        ? "right stuff"
                                        : "not right"}
                                </Dialog.Title>
                                <Dialog.Description as="p">
                                    Change the settings below to update the link{" "}
                                    {FUNCTIONS_DOMAIN}/s/{shortUrl}
                                </Dialog.Description>
                                <div className="mt-2">
                                    <AdvancedOptions
                                        midScreenAdapted={false}
                                        advancedOptions={advancedOptions}
                                        setAdvancedOptions={setAdvancedOptions}
                                    />
                                </div>
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
                                        {status === "editing"
                                            ? "Edit Link"
                                            : status === "loading"
                                            ? "Loading..."
                                            : "Successfully edited!"}
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

// TODO: add loading
