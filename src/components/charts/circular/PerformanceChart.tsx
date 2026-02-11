"use client";

import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import React from "react";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

interface PerformanceChartProps {
    loadTime: number;
    pageSize: number;
    inlineCount: number;
    externalCount: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
    loadTime = 0,
    pageSize = 0,
    inlineCount = 0,
    externalCount = 0
}) => {
    const { theme } = useTheme();

    // Normalize data for visualization (0-100 scale logic for visual segments)
    // But for Polar Area, raw values can sometimes be used if they aren't too disparate.
    // Given: Load Time ~500, Page Size ~75, Counts ~15.
    // 500 vs 15 is too big a gap. The 15 will be invisible.
    // So we MUST normalize to a similar scale (0-100 score).

    const MAX_LOAD_TIME = 2000;
    const MAX_PAGE_SIZE = 200; // KB
    const MAX_SCRIPTS = 50;

    const loadTimeScore = Math.min((loadTime / MAX_LOAD_TIME) * 100, 100);
    const pageSizeScore = Math.min((pageSize / MAX_PAGE_SIZE) * 100, 100);
    const inlineScore = Math.min((inlineCount / MAX_SCRIPTS) * 100, 100);
    const externalScore = Math.min((externalCount / MAX_SCRIPTS) * 100, 100);

    // We want to show the specific metrics.
    const series = [loadTimeScore, pageSizeScore, inlineScore, externalScore];

    const options: ApexOptions = {
        chart: {
            type: 'polarArea',
            toolbar: { show: false }
        },
        stroke: {
            colors: [theme === 'dark' ? '#fff' : '#fff']
        },
        fill: {
            opacity: 0.8
        },
        labels: [
            'Load Time',
            'Page Size',
            'Inline Scripts',
            'External Scripts'
        ],
        colors: ['#3C50E0', '#80CAEE', '#FF8F00', '#FF5733'], // Vibrant
        legend: {
            position: 'bottom',
            labels: {
                colors: theme === "dark" ? "#fff" : "#111",
            }
        },
        yaxis: {
            show: false // Hide the 0-100 radial scale numbers
        },
        plotOptions: {
            polarArea: {
                rings: {
                    strokeWidth: 0
                },
                spokes: {
                    strokeWidth: 0
                },
            }
        },
        tooltip: {
            enabled: true,
            theme: theme === 'dark' ? 'dark' : 'light',
            y: {
                formatter: function (val, { seriesIndex }) {
                    // Return original values
                    if (seriesIndex === 0) return `${loadTime} ms`;
                    if (seriesIndex === 1) return `${pageSize} KB`;
                    if (seriesIndex === 2) return `${inlineCount}`;
                    if (seriesIndex === 3) return `${externalCount}`;
                    return val + "";
                },
                title: {
                    formatter: (seriesName) => seriesName + ": ",
                },
            }
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <ReactApexChart options={options} series={series} type="polarArea" height={350} width={350} />
        </div>
    );
};
