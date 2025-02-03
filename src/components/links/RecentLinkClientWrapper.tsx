'use client';

import React, { useState, useEffect, useCallback } from "react";
import { TableHeading } from "./TableHeading";
import { URL } from "@interfaces";
import { timeDifference } from "@functions/time";
import { useModalContext } from "@/context/GlobalContext";
import { toClipboard } from "copee";
import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";
import { ChartPieIcon, CheckIcon, CopyIcon, PencilIcon, QRCodeIcon, TrashIcon } from "@components/util/Icons";
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

    // Use a local state for the search input so that changes are applied only on form submit
    const [localSearch, setLocalSearch] = useState(search);
    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        setSearch(localSearch);
    };

    const handlePageChange = (action: 'next' | 'previous') => {
        if (action === 'next' && !disabledNext) {
            setPage(page + 1);
        } else if (action === 'previous' && !disabledPrevious) {
            setPage(page - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-1/4 xl:w-[1200px]">
                <div className="flex justify-center items-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-1/4 xl:w-[1200px]">
            <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                    <div className="flex justify-between p-4 bg-white">
                        <form className="flex items-center" onSubmit={handleSearch}>
                            <input
                                type="text"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                placeholder="Search URLs..."
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                Search
                            </button>
                        </form>
                        <div className="flex items-center">
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
                            <span className="mx-2">|</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handlePageChange('previous')}
                                    disabled={disabledPrevious}
                                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange('next')}
                                    disabled={disabledNext}
                                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <TableHeading>Long URL</TableHeading>
                                <TableHeading>Short URL</TableHeading>
                                <TableHeading direction="text-center">Date</TableHeading>
                                <TableHeading>Usage</TableHeading>
                                <TableHeading direction="text-right">Actions</TableHeading>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-gray-200 divide-y">
                            {urls.map((link: URL & { timeStamp: string }) => (
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
        setTimeout(() => {
            setCopySuccess(false);
        }, 1500);
    }, [copySuccess]);

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm link">
                    <a href={longUrl} rel="noreferrer" target="_blank" className="truncate block max-w-xs">
                        {longUrl.length > 50 ? longUrl.substring(0, 50) + '...' : longUrl}
                    </a>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm link">
                    <button
                        className={`text-green-600 bg-green-100 ring-green-50 action-icon ${!copySuccess ? "active" : ""}`}
                        onClick={() => {
                            const success = toClipboard(`${FUNCTIONS_DOMAIN}/s/${shortUrl}`);
                            if (success) {
                                setCopySuccess(true);
                            }
                        }}>
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
            <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                <dfn title="Stats">
                    <button
                        onClick={() => alert("stats maybe link in the future")}
                        className="text-purple-600 bg-purple-100 ring-purple-50 action-icon active"
                        aria-label="open stats modal">
                        <ChartPieIcon />
                    </button>
                </dfn>
                <dfn title="QR Code">
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
                        aria-label="open qrcode modal">
                        <QRCodeIcon />
                    </button>
                </dfn>
                <dfn title="Edit">
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
                        aria-label="Open edit modal">
                        <PencilIcon />
                    </button>
                </dfn>
                <dfn title="Delete">
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
                        aria-label={"Open delete modal"}>
                        <TrashIcon />
                    </button>
                </dfn>
            </td>
        </tr>
    );
};
