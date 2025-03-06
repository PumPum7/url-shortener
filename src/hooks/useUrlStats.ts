import useSWR from "swr";
import { FUNCTIONS_DOMAIN } from "@/functions/urlHandlers";
import { URLStats } from "@/interfaces";

const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch statistics");
    }
    return response.json();
};

export function useUrlStats(shortUrl: string) {
    const { data, error, isLoading, mutate } = useSWR<URLStats>(
        shortUrl ? `${FUNCTIONS_DOMAIN}/api/url/stats/${shortUrl}` : null,
        fetcher
    );

    return {
        stats: data,
        isLoading,
        isError: error,
        refresh: mutate
    };
}
