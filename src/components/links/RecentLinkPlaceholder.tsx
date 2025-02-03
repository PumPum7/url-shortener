import React from 'react';
import { TableHeading } from './TableHeading';

export function RecentLinkPlaceholder(): React.ReactElement {
    const Placeholder = (): React.ReactElement => {
        return (
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-blue-400 rounded-full animate-pulse" />
            </td>
        );
    };

    return (
        <div className="flex flex-col pt-8 w-full xl:transform xl:-translate-x-1/4 xl:w-[1200px]">
            <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
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
                            <tr>
                                <Placeholder />
                                <Placeholder />
                                <Placeholder />
                                <Placeholder />
                                <Placeholder />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
