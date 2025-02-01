import React from "react";
import { getSession } from "@auth0/nextjs-auth0";
import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";
import { RecentLinkClientWrapper } from "./RecentLinkClientWrapper";


async function getUrls(amount: number, skip: number, search: string, accessToken: string) {
    "use server";
    console.log(`Fetching URLs from ${FUNCTIONS_DOMAIN}/api/url/user?amount=${amount}&skip=${skip}&search=${search}`);
    console.log(`Access token: ${accessToken}`);
    try {
        const response = await fetch(
            `${FUNCTIONS_DOMAIN}/api/url/user?amount=${amount}&skip=${skip}&search=${search}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                next: { revalidate: 15 } // Revalidate every 15 seconds
            }
        );

        if (!response.ok) {
            console.log(response)
            throw new Error('Failed to fetch data');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching URLs:', error);
        throw error;
    }
}

export async function RecentLinks({
    amount = 10,
    page = 0,
    search = ""
}: {
    amount?: number;
    page?: number;
    search?: string;
}): Promise<React.ReactElement> {
    const session = await getSession();
    
    if (!session?.accessToken) {
        return (
            <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-1/4 xl:w-[1200px]">
                <div className="flex justify-center items-center p-4 bg-red-50 rounded-lg">
                    <p className="text-red-500">Please log in to view your links.</p>
                </div>
            </div>
        );
    }

    try {
        const data = await getUrls(amount, amount * page, search, session.accessToken);
        const urls = data?.links || [];
        const total = data?.total || 0;

        return (
            <RecentLinkClientWrapper
                urls={urls}
                total={total}
                initialPage={page}
                initialAmount={amount}
                initialSearch={search}
            />
        );
    } catch (error) {
        return (
            <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-1/4 xl:w-[1200px]">
                <div className="flex justify-center items-center p-4 bg-red-50 rounded-lg">
                    <p className="text-red-500">Failed to load recent links. Please try again later.</p>
                </div>
            </div>
        );
    }
}