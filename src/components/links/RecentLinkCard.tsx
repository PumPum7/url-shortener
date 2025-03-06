import { DeleteLinkModal } from "@components/util/DeleteModal";
import { EditLinkModal } from "@components/util/EditModal";
import {
    ChartPieIcon,
    CheckIcon,
    CopyIcon,
    PencilIcon,
    QRCodeIcon,
    TrashIcon,
} from "@components/util/Icons";
import { QRCodeModal } from "@components/util/QRCodeModal";
import { timeDifference } from "@functions/time";
import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";
import { toClipboard } from "copee";

import React, { useCallback, useEffect, useState } from "react";

import { useModalContext } from "@/context/GlobalContext";
import { StatsModal } from "@/components/stats/StatsModal";

interface RecentLinkCardProps {
    longUrl: string;
    shortUrl: string;
    timestamp: string;
    usage: number;
}

export function RecentLinkCard({
    longUrl,
    shortUrl,
    timestamp,
    usage,
}: RecentLinkCardProps): React.ReactElement {
    const timeDifString = timeDifference(timestamp);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const { setModal, removeModal } = useModalContext();

    const closeModal = useCallback(() => {
        removeModal();
    }, [removeModal]);

    const openModal = useCallback(
        (modal: React.ReactElement) => {
            setModal(modal);
        },
        [setModal]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setCopySuccess(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [copySuccess]);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="mb-2">
                <span className="block text-sm text-gray-600 font-medium">
                    Long URL:
                </span>
                <a
                    href={longUrl}
                    rel="noreferrer"
                    target="_blank"
                    className="text-blue-500 truncate block">
                    {longUrl.length > 50
                        ? longUrl.substring(0, 50) + "..."
                        : longUrl}
                </a>
            </div>
            <div className="mb-2">
                <span className="block text-sm text-gray-600 font-medium">
                    Short URL:
                </span>
                <div className="flex items-center">
                    <button
                        onClick={() => {
                            const success = toClipboard(
                                `${FUNCTIONS_DOMAIN}/s/${shortUrl}`
                            );
                            if (success) {
                                setCopySuccess(true);
                            }
                        }}
                        className={`mr-2 text-green-600 bg-green-100 ring-green-50 action-icon ${!copySuccess ? "active" : ""}`}>
                        {copySuccess ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <a
                        href={"/s/" + shortUrl}
                        rel="noreferrer"
                        target="_blank"
                        className="text-blue-500">
                        {FUNCTIONS_DOMAIN.replace("http://", "").replace(
                            "https://",
                            ""
                        )}
                        /s/{shortUrl}
                    </a>
                </div>
            </div>
            <div className="mb-2 flex justify-between items-center">
                <span className="text-sm text-gray-500">{timeDifString}</span>
                <span className="text-sm text-gray-500">Usage: {usage}</span>
            </div>
            <div className="flex justify-end space-x-2">
                <dfn title="View Analytics">
                    <button
                        onClick={() => {
                            openModal(
                                <StatsModal
                                    shortUrl={shortUrl}
                                    closeFunc={closeModal}
                                    isOpen={true}
                                />
                            );
                        }}
                        className="text-purple-600 bg-purple-100 ring-purple-50 action-icon"
                        aria-label="View Analytics">
                        <ChartPieIcon />
                    </button>
                </dfn>
                <dfn title="Show QR Code">
                    <button
                        onClick={() => {
                            openModal(
                                <QRCodeModal
                                    qrcodeValue={shortUrl}
                                    closeFunc={closeModal}
                                    isOpen={true}
                                />
                            );
                        }}
                        className="text-gray-600 bg-gray-100 ring-gray-50 action-icon"
                        aria-label="Show QR Code">
                        <QRCodeIcon />
                    </button>
                </dfn>
                <dfn title="Edit URL">
                    <button
                        onClick={() => {
                            openModal(
                                <EditLinkModal
                                    shortUrl={shortUrl}
                                    closeFunc={closeModal}
                                    isOpen={true}
                                />
                            );
                        }}
                        className="text-yellow-600 bg-yellow-100 ring-yellow-50 action-icon"
                        aria-label="Edit URL">
                        <PencilIcon />
                    </button>
                </dfn>
                <dfn title="Delete URL">
                    <button
                        onClick={() => {
                            openModal(
                                <DeleteLinkModal
                                    shortUrl={shortUrl}
                                    closeFunc={closeModal}
                                    isOpen={true}
                                />
                            );
                        }}
                        className="text-red-600 bg-red-100 ring-red-50 action-icon"
                        aria-label="Delete URL">
                        <TrashIcon />
                    </button>
                </dfn>
            </div>
        </div>
    );
}
