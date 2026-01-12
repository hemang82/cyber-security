"use client";
import React from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false, });

type VulnerabilityItem = {
  label: string;
  count: number;
  percent: number;
  color: string;
};

// Dynamically import the ReactApexChart component

const STATUS_COLORS = {
  BLUE: "#465fff",
  WARNING: "#f0b100",
  SUCCESS: "#10b981",
  DANGER: "#c10007",
  INFO: "#354155",
};


export default function StatisticsChart() {

  // const options: ApexOptions = {
  //   legend: {
  //     show: false, // Hide legend
  //     position: "top",
  //     horizontalAlign: "left",
  //   },
  //   colors: ["#465FFF", "#9CB9FF"], // Define line colors
  //   chart: {
  //     fontFamily: "Outfit, sans-serif",
  //     height: 310,
  //     type: "line", // Set the chart type to 'line'
  //     toolbar: {
  //       show: false, // Hide chart toolbar
  //     },
  //   },
  //   stroke: {
  //     curve: "straight", // Define the line style (straight, smooth, or step)
  //     width: [2, 2], // Line width for each dataset
  //   },

  //   fill: {
  //     type: "gradient",
  //     gradient: {
  //       opacityFrom: 0.55,
  //       opacityTo: 0,
  //     },
  //   },
  //   markers: {
  //     size: 0, // Size of the marker points
  //     strokeColors: "#fff", // Marker border color
  //     strokeWidth: 2,
  //     hover: {
  //       size: 6, // Marker size on hover
  //     },
  //   },
  //   grid: {
  //     xaxis: {
  //       lines: {
  //         show: false, // Hide grid lines on x-axis
  //       },
  //     },
  //     yaxis: {
  //       lines: {
  //         show: true, // Show grid lines on y-axis
  //       },
  //     },
  //   },
  //   dataLabels: {
  //     enabled: false, // Disable data labels
  //   },
  //   tooltip: {
  //     enabled: true, // Enable tooltip
  //     x: {
  //       format: "dd MMM yyyy", // Format for x-axis tooltip
  //     },
  //   },
  //   xaxis: {
  //     type: "category", // Category-based x-axis
  //     categories: [
  //       "Jan",
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //       "Sep",
  //       "Oct",
  //       "Nov",
  //       "Dec",
  //     ],
  //     axisBorder: {
  //       show: false, // Hide x-axis border
  //     },
  //     axisTicks: {
  //       show: false, // Hide x-axis ticks
  //     },
  //     tooltip: {
  //       enabled: false, // Disable tooltip for x-axis points
  //     },
  //   },
  //   yaxis: {
  //     labels: {
  //       style: {
  //         fontSize: "12px", // Adjust font size for y-axis labels
  //         colors: ["#6B7280"], // Color of the labels
  //       },
  //     },
  //     title: {
  //       text: "", // Remove y-axis title
  //       style: {
  //         fontSize: "0px",
  //       },
  //     },
  //   },
  // };

  // const series = [
  //   {
  //     name: "Sales",
  //     data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
  //   },
  //   {
  //     name: "Revenue",
  //     data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
  //   },
  // ];

  const data: VulnerabilityItem[] = [
    { label: "Critical", count: 1116, percent: 32.1, color: STATUS_COLORS.DANGER },
    { label: "High", count: 1565, percent: 45.0, color: STATUS_COLORS.DANGER },
    { label: "Medium", count: 614, percent: 17.7, color: STATUS_COLORS.WARNING },
    { label: "Low", count: 27, percent: 0.8, color: STATUS_COLORS.SUCCESS },
    { label: "Info", count: 153, percent: 4.4, color: STATUS_COLORS.INFO },
  ];

  const series = [0, 3, 0, 0]; // In Progress, Completed, Failed, Scheduled

  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["In Progress", "Completed", "Failed", "Scheduled"],
    colors: [STATUS_COLORS.BLUE, STATUS_COLORS.SUCCESS, STATUS_COLORS.DANGER, STATUS_COLORS.WARNING], // blue, green, red, gray
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      // markers: {
      //   radius: 12,
      // },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              color: "#6B7280",
              formatter: () => "5",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
  };


  return (<>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Vulnerability Distribution
          </h3>
        </div>

        {/* Bars */}
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              {/* Label */}
              <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </div>

              {/* Progress */}
              <div className="relative h-3 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                <div
                  className={`h-3 rounded-full `}
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                />
              </div>

              {/* Value */}
              <div className="w-28 text-right text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{item.count}</span>{" "}
                <span className="text-gray-500">({item.percent}%)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
            Avg Risk Score: <span className="font-semibold">7.4/10</span>
          </div>
          <div className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
            Total: <span className="font-semibold">3475</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Automated Scan
          </h3>
        </div>

        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={260}
        />
      </div>

    </div>
  </>);
}
