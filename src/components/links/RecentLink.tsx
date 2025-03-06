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

import { StatsModal } from "@/components/stats/StatsModal";

import { useModalContext } from "@/context/GlobalContext";

interface RecentLinkProps {
    longUrl: string;
    shortUrl: string;
    timestamp: string;
    usage: number;
}

export function RecentLink({
    longUrl,
    shortUrl,
    timestamp,
    usage,
}: RecentLinkProps): React.ReactElement {
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
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm link">
                    <a
                        href={longUrl}
                        rel="noreferrer"
                        target="_blank"
                        className="truncate block max-w-xs">
                        {longUrl.length > 50
                            ? longUrl.substring(0, 50) + "..."
                            : longUrl}
                    </a>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm link space-x-2">
                    <button
                        className={`text-green-600 bg-green-100 ring-green-50 action-icon ${!copySuccess ? "active" : ""}`}
                        onClick={() => {
                            const success = toClipboard(
                                `${FUNCTIONS_DOMAIN}/s/${shortUrl}`
                            );
                            if (success) {
                                setCopySuccess(true);
                            }
                        }}
                        aria-label="Copy Short URL">
                        {copySuccess ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <a href={"/s/" + shortUrl} rel="noreferrer" target="_blank">
                        {FUNCTIONS_DOMAIN.replace("http://", "").replace(
                            "https://",
                            ""
                        )}
                        /s/{shortUrl}
                    </a>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900 text-sm">{timeDifString}</div>
            </td>
            <td className="px-6 py-4 text-right text-gray-500 whitespace-nowrap text-sm">
                {usage}
            </td>
            <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium space-x-2">
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
                        className="text-purple-600 bg-purple-100 ring-purple-50 action-icon active"
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
                        className="text-gray-600 bg-gray-100 ring-gray-50 action-icon active"
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
                        className="text-yellow-600 bg-yellow-100 ring-yellow-50 action-icon active"
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
                        className="text-red-600 bg-red-100 ring-red-50 action-icon active"
                        aria-label="Delete URL">
                        <TrashIcon />
                    </button>
                </dfn>
            </td>
        </tr>
    );
}
