import { useEffect, useState } from "react";

import { useUser } from "@auth0/nextjs-auth0";

import { getUserUrls } from "@functions/urlHandlers";
import { timeDifference } from "@functions/time";

interface RecentLinkInterface {
    long: string;
    short: string;
    usage: number;
    timeStamp: number;
}

export const RecentLinks = (): JSX.Element => {
    const [recentLinks, setRecentLinks] = useState<[object]>([[]]);
    const [page, setPage] = useState<number>(0);
    const [amount, setAmount] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const { user } = useUser();

    // TODO: fix error handling
    useEffect(() => {
        if (!user) {
            return;
        } else {
            try {
                getUserUrls(amount, amount * page, search).then((res) => {
                    setRecentLinks(res.links);
                });
            } catch (e) {
                console.error(e);
                setError(true);
            }
        }
    }, []);

    return (
        <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-48 xl:w-[1200px]">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-gray-700 text-xs font-medium tracking-wider uppercase">
                                        Original URL
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-gray-700 text-xs font-medium tracking-wider uppercase">
                                        Short
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-gray-700 text-xs font-medium tracking-wider uppercase">
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-gray-700 text-xs font-medium tracking-wider uppercase">
                                        Usage
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-right text-gray-700 text-xs font-medium tracking-wider uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-gray-200 divide-y">
                                {recentLinks.map(
                                    (link: RecentLinkInterface) => (
                                        <RecentLink
                                            longUrl={link.long}
                                            shortUrl={link.short}
                                            timestamp={link.timeStamp}
                                            usage={link.usage}
                                        />
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

    return (
        <tr key={shortUrl}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900 text-sm">{longUrl}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900 text-sm">{shortUrl}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900 text-sm">{timeDifString}</div>
            </td>
            <td className="px-6 py-4 text-gray-500 whitespace-nowrap text-sm">
                {usage}
            </td>
            <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Action
                </a>
            </td>
        </tr>
    );
};
