import React, { useRef, useEffect, Fragment } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import QRCode from "react-qr-code";

interface QRCodeModalProps {
    qrcodeValue: string;
    closeFunc: () => void;
    isOpen: boolean;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
    qrcodeValue,
    closeFunc,
    isOpen,
}) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Focus management: auto-focus the close button when the modal opens
    useEffect(() => {
        if (isOpen && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, [isOpen]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={closeFunc}
                initialFocus={closeButtonRef}
                aria-labelledby="qr-code-modal-title">
                <div className="min-h-screen px-4 text-center">
                    <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />

                    {/* This element is to center the modal contents */}
                    <span
                        className="inline-block h-screen align-middle"
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
                        <DialogPanel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <DialogTitle
                                as="h3"
                                id="qr-code-modal-title"
                                className="text-lg font-medium leading-6 text-gray-900">
                                QR Code
                            </DialogTitle>

                            <div className="mt-4">
                                {qrcodeValue ? (
                                    <div
                                        role="img"
                                        aria-label={`QR Code for ${qrcodeValue}`}>
                                        <QRCode
                                            value={qrcodeValue}
                                            size={192}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-red-500">
                                        QR Code is unavailable
                                    </p>
                                )}
                            </div>

                            <div className="mt-6">
                                <button
                                    ref={closeButtonRef}
                                    type="button"
                                    onClick={closeFunc}
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    aria-label="Close QR Code Modal">
                                    Close
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};
