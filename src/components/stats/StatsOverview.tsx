import React from "react";

import { URLStats } from "@/interfaces";

interface StatsOverviewProps {
    stats: URLStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">Total Clicks</h4>
                <p className="text-2xl font-bold text-blue-900">
                    {stats.totalClicks}
                </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800">Countries</h4>
                <p className="text-2xl font-bold text-green-900">
                    {Object.keys(stats.clicksByCountry).length}
                </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">Last 30 Days</h4>
                <p className="text-2xl font-bold text-purple-900">
                    {calculateLast30DaysClicks(stats.clicksByDay)}
                </p>
            </div>
        </div>
    );
};

function calculateLast30DaysClicks(clicksByDay: Record<string, number>) {
    let totalClicks = 0;
    const today = new Date();

    // Go back 30 days and count clicks
    for (let i = 0; i < 30; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);

        // Format as YYYY-M-D to match the API format
        const year = day.getFullYear();
        const month = day.getMonth() + 1; // getMonth() is 0-indexed
        const date = day.getDate();
        const dayStr = `${year}-${month}-${date}`;

        if (clicksByDay[dayStr]) {
            totalClicks += clicksByDay[dayStr].length;
        }
    }

    console.log(`Total clicks in last 30 days: ${totalClicks}`);

    return totalClicks;
}
