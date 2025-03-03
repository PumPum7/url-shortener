"use client";

import React, { useState } from "react";
import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";
import { RecentLinkClientWrapper } from "./RecentLinkClientWrapper";
import useSWR from "swr";
import { authClient } from "@lib/auth-client";

const fetcher = async (url: string) => {
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 15 },
        });

        if (!response.ok) {
            console.log(response);
            throw new Error("Failed to fetch data");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching URLs:", error);
        throw error;
    }
};

interface RecentLinksProps {
    amount?: number;
    page?: number;
    search?: string;
}

export function RecentLinks({
    amount = 10,
    page = 0,
    search = "",
}: RecentLinksProps): React.ReactElement {
    const { data: session, isPending } = authClient.useSession();

    // Lift pagination state from the props so that updates trigger a re-fetch
    const [currentPage, setCurrentPage] = useState<number>(page);
    const [currentAmount, setCurrentAmount] = useState<number>(amount);
    const [currentSearch, setCurrentSearch] = useState<string>(search);

    const { data, error, isLoading } = useSWR(
        session
            ? `${FUNCTIONS_DOMAIN}/api/url/user?amount=${currentAmount}&skip=${currentAmount * currentPage}&search=${currentSearch}`
            : null,
        (url) => fetcher(url),
        {
            revalidateOnFocus: true,
        }
    );

    if (isPending) {
        return (
            <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-1/4 xl:w-[1200px]">
                <div className="flex justify-center items-center p-4 bg-red-50 rounded-lg">
                    <p className="text-red-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-1/4 xl:w-[1200px]">
                <div className="flex justify-center items-center p-4 bg-red-50 rounded-lg">
                    <p className="text-red-500">
                        Please log in to view your links.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-1/4 xl:w-[1200px]">
                <div className="flex justify-center items-center p-4 bg-red-50 rounded-lg">
                    <p className="text-red-500">
                        Error loading links. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <RecentLinkClientWrapper
            urls={data?.links || []}
            total={data?.total || 0}
            page={currentPage}
            setPage={setCurrentPage}
            amount={currentAmount}
            setAmount={setCurrentAmount}
            search={currentSearch}
            setSearch={setCurrentSearch}
            isLoading={isLoading}
        />
    );
}
