import { FUNCTIONS_DOMAIN, deleteUrl } from "@functions/urlHandlers";
import {
    Description,
    Dialog,
    DialogBackdrop,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import toast from "react-hot-toast";
import { mutate } from "swr";

import React, { Fragment, useState } from "react";

import { useUrlContext } from "@/context/GlobalContext";

interface DeleteLinkModalProps {
    shortUrl: string;
    closeFunc: () => void;
    isOpen: boolean;
    onDelete?: () => void;
}

export const DeleteLinkModal: React.FC<DeleteLinkModalProps> = ({
    shortUrl,
    closeFunc,
    isOpen,
    onDelete,
}) => {
    const [status, setStatus] = useState<"editing" | "loading">("editing");

    const { removeUrl } = useUrlContext();

    const deleteLink = () => {
        setStatus("loading");
        const deleteLinkStatus = deleteUrl(shortUrl);
        toast.promise(
            deleteLinkStatus,
            {
                loading: "Loading...",
                success: () => {
                    setStatus("editing");
                    removeUrl(shortUrl);
                    closeFunc();
                    if (onDelete) onDelete();

                    // Revalidate SWR cache to update the table
                    mutate(
                        (key) =>
                            typeof key === "string" &&
                            key.includes("/api/url/user")
                    );

                    return `Successfully deleted the link ${shortUrl}`;
                },
                error: () => "An error occurred while deleting the link.",
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
                id: "deleteLinkToast",
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
                                Delete Link{" "}
                            </DialogTitle>
                            <Description as="p">
                                Change the settings below to delete the link:
                                <br />
                                <a
                                    className="link"
                                    href={`${FUNCTIONS_DOMAIN}/s/${shortUrl}`}>
                                    {FUNCTIONS_DOMAIN}/s/{shortUrl}
                                </a>
                            </Description>
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
                                    onClick={deleteLink}
                                    disabled={status !== "editing"}>
                                    Delete link
                                </button>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};
