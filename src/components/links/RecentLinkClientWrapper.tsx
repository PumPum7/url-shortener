"use client";

import React from "react";
import { TableHeading } from "./TableHeading";
import { URL } from "@interfaces";
import { Loading, LinkIcon } from "@components/util/Icons";
import { SearchAndPagination } from "./SearchAndPagination";
import { RecentLink } from "./RecentLink";
import { RecentLinkCard } from "./RecentLinkCard";

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
    isLoading,
}: RecentLinkClientWrapperProps): React.ReactElement {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center pt-8 w-full">
                <div className="flex flex-col justify-center items-center p-6 bg-blue-50 rounded-lg space-y-2">
                    <Loading className="w-8 h-8 text-blue-500" />
                    <p className="text-blue-500 font-semibold">
                        Loading your links...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col pt-8 w-full">
            <SearchAndPagination
                total={total}
                page={page}
                setPage={setPage}
                amount={amount}
                setAmount={setAmount}
                search={search}
                setSearch={setSearch}
            />

            {urls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <LinkIcon className="w-16 h-16 text-gray-300" />
                    <p className="mt-4 text-gray-500">
                        No links found. Try adjusting your search or create a
                        new link.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <div className="overflow-x-scroll border-b border-gray-200 shadow sm:rounded-lg">
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
                                    {urls.map(
                                        (
                                            link: URL & {
                                                timeStamp: string;
                                                usage: number;
                                                long: string;
                                                short: string;
                                            }
                                        ) => (
                                            <RecentLink
                                                key={link.short}
                                                longUrl={link.long}
                                                shortUrl={link.short}
                                                timestamp={link.timeStamp}
                                                usage={link.usage}
                                            />
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden space-y-4">
                        {urls.map(
                            (
                                link: URL & {
                                    timeStamp: string;
                                    usage: number;
                                    long: string;
                                    short: string;
                                }
                            ) => (
                                <RecentLinkCard
                                    key={link.short}
                                    longUrl={link.long}
                                    shortUrl={link.short}
                                    timestamp={link.timeStamp}
                                    usage={link.usage}
                                />
                            )
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
