import React from "react";

import { URLClickStats } from "@/interfaces";

interface StatsRecentClicksProps {
    clicks: URLClickStats[];
}

export const StatsRecentClicks: React.FC<StatsRecentClicksProps> = ({
    clicks,
}) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <h4 className="font-medium p-4 border-b">Recent Clicks</h4>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Device
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clicks.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-4 text-center text-gray-500">
                                    No clicks recorded yet
                                </td>
                            </tr>
                        ) : (
                            clicks.map((click, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatTimestamp(click.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatLocation(click)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatUserAgent(click.userAgent)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

function formatTimestamp(timestamp: number) {
    return new Date(timestamp.isoString).toLocaleString();
}

function formatLocation(click: URLClickStats) {
    const parts = [];
    if (click.city) parts.push(click.city);
    if (click.region) parts.push(click.region);
    if (click.country) parts.push(click.country);

    return parts.length > 0 && click.country !== "unknown"
        ? parts.join(", ")
        : "Unknown";
}

function formatUserAgent(userAgent?: string) {
    // Simple user agent parser - in production you might want a more robust solution
    if (!userAgent) return "Unknown";

    if (userAgent.includes("Mobile")) return "Mobile";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    if (userAgent.includes("MSIE") || userAgent.includes("Trident"))
        return "Internet Explorer";

    return "Other";
}
