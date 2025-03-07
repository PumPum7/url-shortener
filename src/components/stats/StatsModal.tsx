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
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={closeFunc}>
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
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
                        <div className="inline-block w-full max-w-md md:max-w-lg align-bottom sm:align-middle my-2 p-3 sm:p-6 text-left bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
                            <DialogTitle
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900">
                                Statistics for {shortUrl}
                            </DialogTitle>

                            <div className="mt-4 max-h-[70vh] overflow-y-auto">
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
