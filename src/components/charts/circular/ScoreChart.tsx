"use client";

import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import React from "react";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

interface ScoreChartProps {
    score: number | string;
    color: string;
    width?: number;
    height?: number;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ score, color, width = 120, height = 150 }) => {
    const { theme } = useTheme();

    const numericScore = typeof score === 'string' ? parseFloat(score) : score;
    const safeScore = isNaN(numericScore) ? 0 : numericScore;

    const series = [safeScore];

    const options: ApexOptions = {
        chart: {
            type: "radialBar",
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: theme === "dark" ? "#333" : "#e7e7e7",
                    strokeWidth: "97%",
                    margin: 5, // margin is in pixels
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: -2,
                        fontSize: "22px",
                        fontWeight: "bold",
                        color: theme === "dark" ? "#fff" : "#111",
                        formatter: function (val) {
                            return val + "";
                        }
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -10
            }
        },
        fill: {
            colors: [color],
            type: "solid",
        },
        labels: ["Score"],
        colors: [color],
    };

    return (
        <div className="flex items-center justify-center overflow-hidden">
            <ReactApexChart options={options} series={series} type="radialBar" width={width} height={height} />
        </div>
    );
};
