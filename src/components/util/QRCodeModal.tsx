import { Fragment } from "react";

import { Dialog, Transition } from "@headlessui/react";
import QRCode from "qrcode-react";

export const QRCodeModal = ({
    qrcodeValue,
    closeFunc,
    isOpen,
}: {
    qrcodeValue: string;
    openFunc: () => void;
    closeFunc: () => void;
    isOpen: boolean;
}): JSX.Element => {
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 bg-gray-500 bg-opacity-60 overflow-y-auto transition-opacity"
                    onClose={closeFunc}>
                    <div className="px-4 min-h-screen text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

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
                                    className="text-gray-900 text-lg font-medium leading-6">
                                    QR Code
                                </Dialog.Title>
                                <div className="mt-2">
                                    <QRCode value={qrcodeValue} size={192} />
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-blue-900 text-sm font-medium bg-blue-100 hover:bg-blue-200 border border-transparent rounded-md focus:outline-none hover:cursor-pointer focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-2"
                                        onClick={closeFunc}>
                                        Close
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

// TODO: fix qr code modal overlay
