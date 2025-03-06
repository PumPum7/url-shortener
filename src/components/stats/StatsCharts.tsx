import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import React from "react";

import { URLStats } from "@/interfaces";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface StatsChartsProps {
    stats: URLStats;
}

export const StatsCharts: React.FC<StatsChartsProps> = ({ stats }) => {
    // Prepare data for country chart
    const countryLabels = Object.keys(stats.clicksByCountry)
        .sort((a, b) => stats.clicksByCountry[b] - stats.clicksByCountry[a])
        .slice(0, 10);

    const countryData = {
        labels: countryLabels,
        datasets: [
            {
                label: "Clicks by Country",
                data: countryLabels.map(
                    (country) => stats.clicksByCountry[country].length
                ),
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    };

    // Prepare data for timeline chart
    const timelineData = prepareTimelineData(stats.clicksByDay);

    console.log(timelineData);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium mb-4">Top Countries</h4>
                <Bar data={countryData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium mb-4">Clicks Over Time</h4>
                <Bar data={timelineData} />
            </div>
        </div>
    );
};

function prepareTimelineData(clicksByDay: Record<string, number>) {
    // Get last 14 days
    const days: string[] = [];
    const today = new Date();

    for (let i = 13; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        days.push(day.toISOString().split("T")[0]);
    }

    console.log(clicksByDay);

    return {
        labels: days.map((day) => day.split("-").slice(1).join("/")), // Format as MM/DD
        datasets: [
            {
                label: "Clicks",
                data: days.map((day) => {
                    console.log(
                        `${today.getFullYear()}-${day
                            .replace("0", "")
                            .split("/")
                            .join("-")}`
                    );

                    return (
                        clicksByDay[
                            `${today.getFullYear()}-${day
                                .replace("0", "")
                                .split("/")
                                .slice(1)
                                .join("-")}`
                        ]?.length || 0
                    );
                }),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
        ],
    };
}
