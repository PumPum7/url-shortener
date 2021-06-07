import React, { useEffect, useState } from "react";

import { useUser } from "@auth0/nextjs-auth0";
import { toClipboard } from "copee";
import toast from "react-hot-toast";

import { getUserUrls } from "@functions/urlHandlers";
import { timeDifference } from "@functions/time";

import { QRCodeModal } from "@components/util/QRCodeModal";
import {
    CopyIcon,
    CheckIcon,
    QRCodeIcon,
    TrashIcon,
    PencilIcon,
    ChartPieIcon,
} from "@components/Layout/Icons";

import { useModalStore } from "@functions/globalZustand";
import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";
import { EditLinkModal } from "@components/util/EditModal";

interface RecentLinkInterface {
    long: string;
    short: string;
    usage: number;
    timeStamp: number;
}

export const RecentLinks = (): JSX.Element => {
    const [recentLinks, setRecentLinks] = useState<[RecentLinkInterface]>([
        {
            long: "",
            short: "",
            usage: 0,
            timeStamp: 0,
        },
    ]);
    const [totalLinks, setTotalLinks] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [amount, setAmount] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            return;
        } else {
            try {
                getUserUrls(amount, amount * page, search).then((res) => {
                    setRecentLinks(res.links);
                    setTotalLinks(res.total);
                });
            } catch (e) {
                toast.error(
                    "Something went wrong while retrieving recent links!"
                );
                setError(true);
            }
        }
    }, []);

    return (
        <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-48 xl:w-[1200px]">
            <h2 className="pb-2 pl-2 md:pb-4 md:pl-0">
                Recently shortened links
            </h2>
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 xl:overflow-x-visible">
                <div className="inline-block align-middle py-2 min-w-full sm:px-6 lg:px-8">
                    <div className="border-b border-gray-200 shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-gray-200 divide-y">
                            <thead>
                                <tr className="p-4 border-b-2 border-gray-300">
                                    <th
                                        scope="col"
                                        className="p-4 text-left tracking-wider">
                                        <form>
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="py-1 rounded-md"
                                            />
                                        </form>
                                    </th>
                                    <th
                                        scope="col"
                                        colSpan={4}
                                        className="p-4 text-right tracking-wider">
                                        <div>Placeholder</div>
                                    </th>
                                </tr>
                                <tr className="justify-between">
                                    <TableHeading>Original URL</TableHeading>
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
                            <tbody className="bg-white divide-gray-200 divide-y">
                                {recentLinks[0].long === "" ? (
                                    <RecentLinkPlaceholder />
                                ) : (
                                    recentLinks.map(
                                        (
                                            link: RecentLinkInterface,
                                            index: number
                                        ) => (
                                            <RecentLink
                                                longUrl={link.long}
                                                shortUrl={link.short}
                                                timestamp={link.timeStamp}
                                                usage={link.usage}
                                                key={index}
                                            />
                                        )
                                    )
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan={5}>
                                        <div className="p-2 text-right">
                                            Placeholder
                                        </div>
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TableHeading = ({
    direction = "text-left",
    children,
}: {
    direction?: string;
    children: React.ReactNode;
}): JSX.Element => {
    return (
        <th
            scope="col"
            className={
                "px-6 py-4 text-gray-700 text-xs font-medium tracking-wider uppercase " +
                direction
            }>
            {children}
        </th>
    );
};

interface ModalShowTypes {
    qrcode: boolean;
    edit: boolean;
    delete: boolean;
}

export const RecentLink = ({
    longUrl,
    shortUrl,
    timestamp,
    usage,
}: {
    longUrl: string;
    shortUrl: string;
    timestamp: number;
    usage: number;
}): JSX.Element => {
    const timeDifString = timeDifference(timestamp);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const { setModal, removeModal } = useModalStore((state) => ({
        setModal: state.setModal,
        removeModal: state.removeModal,
    }));

    let isModalOpen: ModalShowTypes = {
        qrcode: false,
        edit: false,
        delete: false,
    };

    function closeModal(modalType: "qrcode" | "edit" | "delete") {
        removeModal();
        isModalOpen = { ...isModalOpen, [modalType]: false };
    }

    function setActiveModal(modal: JSX.Element) {
        setModal(modal);
    }

    function openModal(modalType: "qrcode" | "edit" | "delete") {
        isModalOpen = { ...isModalOpen, [modalType]: true };
    }

    useEffect(() => {
        setTimeout(() => {
            setCopySuccess(false);
        }, 1500);
    }, [copySuccess]);

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm link">
                    <a href={longUrl} rel="noreferrer" target="_blank">
                        {longUrl}
                    </a>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex text-sm link">
                    <button
                        className={`text-green-600 bg-green-100 ring-green-50 action-icon ${
                            !copySuccess ? "active" : ""
                        }`}
                        onClick={() => {
                            const success = toClipboard(
                                `${FUNCTIONS_DOMAIN}/s/${shortUrl}`
                            );
                            if (success) {
                                setCopySuccess(true);
                            }
                        }}>
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
                            openModal("qrcode");
                            setActiveModal(
                                <QRCodeModal
                                    qrcodeValue={shortUrl}
                                    closeFunc={() => closeModal("qrcode")}
                                    isOpen={isModalOpen.qrcode}
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
                            openModal("edit");
                            setActiveModal(
                                <EditLinkModal
                                    shortUrl={shortUrl}
                                    closeFunc={() => closeModal("edit")}
                                    isOpen={isModalOpen.edit}
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
                        onClick={() => alert("delete modal here")}
                        className="text-red-600 bg-red-100 ring-red-50 action-icon active"
                        aria-label={"Open delete modal"}>
                        <TrashIcon />
                    </button>
                </dfn>
            </td>
        </tr>
    );
};

export const RecentLinkPlaceholder = (): JSX.Element => {
    const Placeholder = (): JSX.Element => {
        return (
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-blue-400 rounded-full" />
            </td>
        );
    };

    return (
        <tr className="animate-pulse">
            <Placeholder />
            <Placeholder />
            <Placeholder />
            <Placeholder />
            <Placeholder />
        </tr>
    );
};

// TODO: show a loader instead of a blank/one wrong link table
