'use client';

import React, { useState, useEffect, useCallback } from "react";
import { TableHeading } from "./TableHeading";
import { URL } from "@interfaces";
import { timeDifference } from "@functions/time";
import { useModalContext } from "@/context/GlobalContext";
import { toClipboard } from "copee";
import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";
import { Loading, ChartPieIcon, CheckIcon, CopyIcon, PencilIcon, QRCodeIcon, TrashIcon, LinkIcon } from "@components/util/Icons";
import { QRCodeModal } from "@components/util/QRCodeModal";
import { DeleteLinkModal } from "@components/util/DeleteModal";
import { EditLinkModal } from "@components/util/EditModal";

interface RecentLinkClientWrapperProps {
    urls: URL[];
    total: number;
    page: number;
    setPage: (page: number) => void;
    amount: number;
    setAmount: (amount: number) => void;
    search: string;
    setSearch: (search: string) => void;
    isLoading: boolean;
}   

export function RecentLinkClientWrapper({
    urls,
    total,
    page,
    setPage,
    amount,
    setAmount,
    search,
    setSearch,
    isLoading
}: RecentLinkClientWrapperProps): React.ReactElement {
    // Compute disabled state based on current page and total records
    const disabledPrevious = page === 0;
    const disabledNext = (page + 1) * amount >= total;

    // Local state for the search input so that changes are applied only on form submit
    const [localSearch, setLocalSearch] = useState(search);
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        setSearch(localSearch);
    };

    const handlePageChange = (action: "next" | "previous") => {
        if (action === "next" && !disabledNext) {
            setPage(page + 1);
        } else if (action === "previous" && !disabledPrevious) {
            setPage(page - 1);
        }
    };

    // Calculate pagination info
    const start = total > 0 ? page * amount + 1 : 0;
    const end = total > 0 ? Math.min((page + 1) * amount, total) : 0;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center pt-8 w-full xl:transform xl:-translate-x-1/4 xl:w-[1200px]">
                <div className="flex flex-col justify-center items-center p-6 bg-blue-50 rounded-lg space-y-2">
                    <Loading className="w-8 h-8 text-blue-500" />
                    <p className="text-blue-500 font-semibold">Loading your links...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col pt-8 w-full px-4 md:w-[80vw] md:transform md:-translate-x-1/2 lg:-translate-x-1/4">
            {/* Shared Search and Pagination Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white mb-4 rounded-lg shadow">
                <form
                    className="flex items-center w-full md:w-auto"
                    onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search URLs..."
                        className="form-input"
                    />
                    <button type="submit" className="ml-2 form-button">
                        Search
                    </button>
                </form>
                <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-4">
                    <div className="text-gray-600 text-sm">
                        {total > 0 ? `Showing ${start} - ${end} of ${total}` : ""}
                    </div>
                    <div className="flex items-center space-x-2">
                        <select
                            value={amount}
                            onChange={(e) => {
                                setAmount(Number(e.target.value));
                                setPage(0);
                            }}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="mx-2 block">|</span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange("previous")}
                                disabled={disabledPrevious}
                                className="btn-secondary disabled:opacity-50 disabled:hover:cursor-not-allowed">
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange("next")}
                                disabled={disabledNext}
                                className="btn-secondary disabled:opacity-50 disabled:hover:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {urls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <LinkIcon className="w-16 h-16 text-gray-300" />
                    <p className="mt-4 text-gray-500">
                        No links found. Try adjusting your search or create a new link.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <TableHeading>Long URL</TableHeading>
                                        <TableHeading>Short URL</TableHeading>
                                        <TableHeading direction="text-center">
                                            Date
                                        </TableHeading>
                                        <TableHeading>Usage</TableHeading>
                                        <TableHeading direction="text-right">
                                            Actions
                                        </TableHeading>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {urls.map((link: URL & { timeStamp: string, usage: number, long: string, short: string }) => (
                                        <RecentLink
                                            key={link.short}
                                            longUrl={link.long}
                                            shortUrl={link.short}
                                            timestamp={link.timeStamp}
                                            usage={link.usage}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden space-y-4">
                        {urls.map((link: URL & { timeStamp: string, usage: number, long: string, short: string }) => (
                            <RecentLinkCard
                                key={link.short}
                                longUrl={link.long}
                                shortUrl={link.short}
                                timestamp={link.timeStamp}
                                usage={link.usage}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

const RecentLink = ({
    longUrl,
    shortUrl,
    timestamp,
    usage,
}: {
    longUrl: string;
    shortUrl: string;
    timestamp: string;
    usage: number;
}): React.ReactElement => {
    const timeDifString = timeDifference(timestamp);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const { setModal, removeModal } = useModalContext();

    const closeModal = useCallback(() => {
        removeModal();
    }, [removeModal]);

    const openModal = useCallback((modal: React.ReactElement) => {
        setModal(modal);
    }, [setModal]);

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
                        className="truncate block max-w-xs"
                    >
                        {longUrl.length > 50 ? longUrl.substring(0, 50) + "..." : longUrl}
                    </a>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm link space-x-2">
                    <button
                        className={`text-green-600 bg-green-100 ring-green-50 action-icon ${!copySuccess ? "active" : ""}`}
                        onClick={() => {
                            const success = toClipboard(`${FUNCTIONS_DOMAIN}/s/${shortUrl}`);
                            if (success) {
                                setCopySuccess(true);
                            }
                        }}
                        aria-label="Copy Short URL"
                    >
                        {copySuccess ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <a href={"/s/" + shortUrl} rel="noreferrer" target="_blank">
                        {FUNCTIONS_DOMAIN.replace("http://", "").replace("https://", "")}/s/{shortUrl}
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
                        onClick={() => alert("Stats feature coming soon")}
                        className="text-purple-600 bg-purple-100 ring-purple-50 action-icon active"
                        aria-label="View Analytics"
                    >
                        <ChartPieIcon />
                    </button>
                </dfn>
                <dfn title="Show QR Code">
                    <button
                        onClick={() => {
                            openModal(
                                <QRCodeModal
                                    qrcodeValue={shortUrl}
                                    closeFunc={() => closeModal()}
                                    isOpen={true}
                                />
                            );
                        }}
                        className="text-gray-600 bg-gray-100 ring-gray-50 action-icon active"
                        aria-label="Show QR Code"
                    >
                        <QRCodeIcon />
                    </button>
                </dfn>
                <dfn title="Edit URL">
                    <button
                        onClick={() => {
                            openModal(
                                <EditLinkModal
                                    shortUrl={shortUrl}
                                    closeFunc={() => closeModal()}
                                    isOpen={true}
                                />
                            );
                        }}
                        className="text-yellow-600 bg-yellow-100 ring-yellow-50 action-icon active"
                        aria-label="Edit URL"
                    >
                        <PencilIcon />
                    </button>
                </dfn>
                <dfn title="Delete URL">
                    <button
                        onClick={() => {
                            openModal(
                                <DeleteLinkModal
                                    shortUrl={shortUrl}
                                    closeFunc={() => closeModal()}
                                    isOpen={true}
                                />
                            );
                        }}
                        className="text-red-600 bg-red-100 ring-red-50 action-icon active"
                        aria-label="Delete URL"
                    >
                        <TrashIcon />
                    </button>
                </dfn>
            </td>
        </tr>
    );
};

const RecentLinkCard = ({
    longUrl,
    shortUrl,
    timestamp,
    usage,
}: {
    longUrl: string;
    shortUrl: string;
    timestamp: string;
    usage: number;
}): React.ReactElement => {
    const timeDifString = timeDifference(timestamp);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const { setModal, removeModal } = useModalContext();

    const closeModal = useCallback(() => {
        removeModal();
    }, [removeModal]);

    const openModal = useCallback((modal: React.ReactElement) => {
        setModal(modal);
    }, [setModal]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCopySuccess(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [copySuccess]);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="mb-2">
                <span className="block text-sm text-gray-600 font-medium">Long URL:</span>
                <a
                    href={longUrl}
                    rel="noreferrer"
                    target="_blank"
                    className="text-blue-500 truncate block"
                >
                    {longUrl.length > 50 ? longUrl.substring(0, 50) + "..." : longUrl}
                </a>
            </div>
            <div className="mb-2">
                <span className="block text-sm text-gray-600 font-medium">Short URL:</span>
                <div className="flex items-center">
                    <button
                        onClick={() => {
                            const success = toClipboard(`${FUNCTIONS_DOMAIN}/s/${shortUrl}`);
                            if (success) {
                                setCopySuccess(true);
                            }
                        }}
                        className={`mr-2 text-green-600 bg-green-100 ring-green-50 action-icon ${!copySuccess ? "active" : ""}`}
                    >
                        {copySuccess ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <a
                        href={"/s/" + shortUrl}
                        rel="noreferrer"
                        target="_blank"
                        className="text-blue-500"
                    >
                        {FUNCTIONS_DOMAIN.replace("http://", "").replace("https://", "")}/s/{shortUrl}
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
                        onClick={() => alert("Stats feature coming soon")}
                        className="text-purple-600 bg-purple-100 ring-purple-50 action-icon"
                        aria-label="View Analytics"
                    >
                        <ChartPieIcon />
                    </button>
                </dfn>
                <dfn title="Show QR Code">
                    <button
                        onClick={() => {
                            openModal(
                                <QRCodeModal
                                    qrcodeValue={shortUrl}
                                    closeFunc={() => closeModal()}
                                    isOpen={true}
                                />
                            );
                        }}
                        className="text-gray-600 bg-gray-100 ring-gray-50 action-icon"
                        aria-label="Show QR Code"
                    >
                        <QRCodeIcon />
                    </button>
                </dfn>
                <dfn title="Edit URL">
                    <button
                        onClick={() => {
                            openModal(
                                <EditLinkModal
                                    shortUrl={shortUrl}
                                    closeFunc={() => closeModal()}
                                    isOpen={true}
                                />
                            );
                        }}
                        className="text-yellow-600 bg-yellow-100 ring-yellow-50 action-icon"
                        aria-label="Edit URL"
                    >
                        <PencilIcon />
                    </button>
                </dfn>
                <dfn title="Delete URL">
                    <button
                        onClick={() => {
                            openModal(
                                <DeleteLinkModal
                                    shortUrl={shortUrl}
                                    closeFunc={() => closeModal()}
                                    isOpen={true}
                                />
                            );
                        }}
                        className="text-red-600 bg-red-100 ring-red-50 action-icon"
                        aria-label="Delete URL"
                    >
                        <TrashIcon />
                    </button>
                </dfn>
            </div>
        </div>
    );
};
