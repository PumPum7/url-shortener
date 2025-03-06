import {
    Dialog,
    DialogBackdrop,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";

import React, { Fragment } from "react";

import { Loading } from "@/components/util/Icons";

import { useUrlStats } from "@/hooks/useUrlStats";

import { StatsCharts } from "./StatsCharts";
import { StatsOverview } from "./StatsOverview";
import { StatsRecentClicks } from "./StatsRecentClicks";

interface StatsModalProps {
    shortUrl: string;
    closeFunc: () => void;
    isOpen: boolean;
}

export const StatsModal: React.FC<StatsModalProps> = ({
    shortUrl,
    closeFunc,
    isOpen,
}) => {
    const { stats, isLoading, isError } = useUrlStats(shortUrl);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
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
                        <div className="inline-block align-middle my-8 p-6 max-w-2xl text-left bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
                            <DialogTitle
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900">
                                Statistics for {shortUrl}
                            </DialogTitle>

                            <div className="mt-4">
                                {isLoading && (
                                    <div className="flex justify-center">
                                        <Loading className="w-8 h-8 text-blue-500" />
                                    </div>
                                )}

                                {isError && (
                                    <div className="text-red-500">
                                        Failed to load statistics
                                    </div>
                                )}

                                {stats && (
                                    <div className="space-y-6">
                                        <StatsOverview stats={stats} />
                                        <StatsCharts stats={stats} />
                                        <StatsRecentClicks
                                            clicks={stats.recentClicks.data}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={closeFunc}
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                                    Close
                                </button>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};
