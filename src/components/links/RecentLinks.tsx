import React, { useEffect, useState, useRef } from "react";

import { useUser } from "@auth0/nextjs-auth0";
import { toClipboard } from "copee";
import toast from "react-hot-toast";

import { timeDifference } from "@functions/time";
import { useModalStore, useUrlStore } from "@functions/globalZustand";
import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";

import { QRCodeModal } from "@components/util/QRCodeModal";
import { EditLinkModal } from "@components/util/EditModal";
import { DeleteLinkModal } from "@components/util/DeleteModal";
import {
    ChartPieIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CopyIcon,
    PencilIcon,
    QRCodeIcon,
    TrashIcon,
} from "@components/util/Icons";

interface RecentLinkInterface {
    long: string;
    short: string;
    usage: number;
    timeStamp: number;
}

export const RecentLinks = (): JSX.Element => {
    const [page, setPage] = useState<number>(0);
    const [amount, setAmount] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [disabledButton, setDisabledButton] = useState<{
        previous: boolean;
        next: boolean;
    }>({ previous: true, next: false });

    const { user } = useUser();

    const searchField = useRef();

    const { getUrls, urls, total } = useUrlStore((state) => ({
        getUrls: state.getUrls,
        urls: state.urls,
        total: state.total,
    }));

    const fetchUrls = (specificPage: number = page) => {
        try {
            getUrls(
                amount,
                amount * specificPage > 0 ? amount * specificPage : 0,
                search
            );
        } catch (e) {
            toast.error("Something went wrong while retrieving recent links!");
            setError(true);
        }
    };

    const changePage = ({ action }: { action: "next" | "previous" }): void => {
        if (action === "next") {
            if (page * amount < total) {
                setPage((prevState) => {
                    fetchUrls(prevState + 1);
                    return prevState + 1;
                });
            }
        } else if (action === "previous") {
            if (page !== 0) {
                setPage((prevState) => {
                    fetchUrls(prevState - 1);
                    return prevState - 1;
                });
            }
        }
    };

    useEffect(() => {
        if (!user) {
            return;
        } else {
            fetchUrls();
        }
    }, []);

    useEffect(() => {
        let newDisabledButtons = { next: false, previous: false };
        newDisabledButtons.previous = page === 0;
        newDisabledButtons.next = (page + 1) * amount >= total;
        setDisabledButton(newDisabledButtons);
    }, [page, total, amount]);

    useEffect(() => {
        fetchUrls();
    }, [amount]);

    useEffect(() => {
        fetchUrls();
    }, [search]);

    return (
        <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-1/4 xl:w-[1200px]">
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
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (searchField.current) {
                                                    setSearch(
                                                        // @ts-ignore
                                                        searchField.current
                                                            .value
                                                    );
                                                    setPage(0);
                                                }
                                            }}>
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="py-1 rounded-md"
                                                ref={searchField}
                                            />
                                        </form>
                                    </th>
                                    <th
                                        scope="col"
                                        colSpan={4}
                                        className="p-4 text-right tracking-wider">
                                        <div className="flex flex-row items-center justify-end">
                                            <RecentLinkAmountSelector
                                                setAmount={setAmount}
                                                amount={amount}
                                            />
                                            <span className="ml-2 text-gray-600 opacity-50">
                                                {" "}
                                                |{" "}
                                            </span>
                                            <RecentLinkPageSelector
                                                changePage={changePage}
                                                disabledButton={disabledButton}
                                            />
                                        </div>
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
                                {urls[0].long === "" ? (
                                    <RecentLinkPlaceholder />
                                ) : (
                                    urls.map(
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
                                        <div className="p-2 pr-4 text-right">
                                            Page {page + 1}/
                                            {Math.ceil(total / amount)}
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
                <div className="flex items-center text-sm link">
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
                        onClick={() => {
                            openModal("delete");
                            setActiveModal(
                                <DeleteLinkModal
                                    shortUrl={shortUrl}
                                    closeFunc={() => closeModal("delete")}
                                    isOpen={isModalOpen.delete}
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

interface RecentLinkPageSelectorParams {
    disabledButton: { previous: boolean; next: boolean };
    changePage: ({ action }: { action: "next" | "previous" }) => void;
}

const RecentLinkPageSelector = ({
    disabledButton,
    changePage,
}: RecentLinkPageSelectorParams): JSX.Element => {
    return (
        <div className="flex flex-row justify-end">
            <RecentLinkPageSelectorButton
                disabled={disabledButton.previous}
                changePage={() => changePage({ action: "previous" })}>
                <ChevronLeftIcon />
            </RecentLinkPageSelectorButton>
            <RecentLinkPageSelectorButton
                disabled={disabledButton.next}
                changePage={() => changePage({ action: "next" })}>
                <ChevronRightIcon />
            </RecentLinkPageSelectorButton>
        </div>
    );
};

const RecentLinkPageSelectorButton = ({
    children,
    disabled,
    changePage,
}: {
    children: React.ReactNode;
    disabled: boolean;
    changePage: () => void;
}): JSX.Element => {
    return (
        <button
            className="recent-links-button"
            onClick={() => changePage()}
            disabled={disabled}>
            {children}
        </button>
    );
};

const RecentLinkAmountSelector = ({
    setAmount,
    amount,
}: {
    setAmount: React.Dispatch<React.SetStateAction<number>>;
    amount: number;
}): JSX.Element => {
    return (
        <div className="flex flex-row justify-end">
            <RecentLinkAmountSelectorButton
                amount={"10"}
                setAmount={() => setAmount(10)}
                disabled={amount === 10}
            />
            <RecentLinkAmountSelectorButton
                amount={"25"}
                setAmount={() => setAmount(25)}
                disabled={amount === 25}
            />
            <RecentLinkAmountSelectorButton
                amount={"50"}
                setAmount={() => setAmount(50)}
                disabled={amount === 50}
            />
        </div>
    );
};

const RecentLinkAmountSelectorButton = ({
    amount,
    setAmount,
    disabled,
}: {
    amount: string;
    setAmount: () => void;
    disabled: boolean;
}): JSX.Element => {
    return (
        <button
            className="recent-links-button"
            onClick={() => setAmount()}
            disabled={disabled}>
            {amount}
        </button>
    );
};
