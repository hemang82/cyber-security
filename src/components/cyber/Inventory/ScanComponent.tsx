"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../ui/table";
import Image from "next/image";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useInventoryStore } from "@/store";
import { Badge, CyberColorClass, severityColor } from "./assetsDetails/WebsiteDetails";
import { GoEye } from "react-icons/go";
import { ASSETS } from "./Assets/AssetsTypes";

export default function ScanComponent({ ScanHistory, resInventoryList }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { setLoader, resetInventory } = useInventoryStore();

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("page_size")) || 15;

  const scanList = Array.isArray(ScanHistory?.scans) ? ScanHistory.scans : (Array.isArray(ScanHistory) ? ScanHistory : []);
  const totalCount = ScanHistory?.total_count || scanList.length;

  // Since the API returns the paginated data, we don't slice it here.
  const startIndex = (page - 1) * perPage;
  const currentData = scanList.map((item: any, index: number) => ({
    ...item,
    displayId: startIndex + index + 1
  }));

  const columns = [
    {
      key: "displayId",
      title: "ID",
      className: "min-w-[70px]",
    },
    {
      key: "asset_name",
      title: "Assets Name",
      className: "min-w-[300px]",
      render: (row: any) => (
        <span title={row?.asset_name} className="block w-full max-w-[300px] truncate">
          {safeText(row?.asset_name)}
        </span>
      ),
    },
    {
      key: "type",
      title: "Type",
      className: "min-w-[150px]",
      render: (row: any) => (
        <div className="">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-gray-800 dark:text-gray-200">
            {ASSETS.find((item) => item?.key === row?.asset_type)?.title || "Website"}
          </span>
        </div>
      ),
    },
    {
      key: "vulnerabilities",
      title: "Vulnerabilities",
      className: "min-w-[220px]",
      render: (row: any) => {
        const vulnerabilities = row?.full_response?.finding_counts || [];
        return (
          <div className="flex flex-wrap gap-2">
            {vulnerabilities?.length > 0 ? vulnerabilities?.map((item: any, index: number) => (
              <Badge key={index} color={item?.color} classname="!text-xs ">
                {item?.count}
              </Badge>
            )) : <> <Badge classname="!text-xs " color="red">0</Badge><Badge classname="!text-xs " color="orange">0</Badge><Badge classname="!text-xs " color="yellow">0</Badge><Badge classname="!text-xs " color="green">0</Badge><Badge classname="!text-xs " color="green">0</Badge></>}
          </div>
        );
      },
    },
    {
      key: "output_score", title: "Security Score",
      className: "min-w-[150px]",
      render: (row: any) => (<>
        {/* // <Badge size="sm" color={row.risk_level && severityColor(row.risk_level) || '12'}>
        //   {row.risk_level || "Warning"}
        // </Badge> */}
        {safeText(row?.full_response?.security_score) || "Info"}
      </>),
    },
    {
      key: "serverity", title: "Serverity",
      className: "min-w-[150px]",
      render: (row: any) => (
        <span
          className={`rounded-full px-2 py-0.5 text-sm font-medium ${CyberColorClass[row?.risk_color as keyof typeof CyberColorClass]} `} >
          {safeText(row?.risk_level) || "Info"}
        </span>
      ),
    },
    {
      key: "created_at", title: "Created At",
      className: "min-w-[150px]",
      render: (row: any) => (
        <span>{formatDate(row?.scanned_at, DATE_FORMAT?.DASH_DD_MM_YYYY)}</span>
      ),
    },
    {
      key: "status", title: "Status",
      className: "min-w-[150px]",
      render: (row: any) => (
        <span
          className={`rounded-md px-2 py-0.5 text-sm border font-medium ${CyberColorClass[row?.status as keyof typeof CyberColorClass]} `} >
          {safeText(row?.status) || "Info"}
        </span>
      ),
    },
    {
      key: "action", title: "Action",
      className: "min-w-[100px]",
      render: (row: any) => (
        <button className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400 shadow-theme-xs inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" onClick={() => {
          router.push(`/asset-view?id=${encodeURIComponent(row?.id)}&type=${row?.asset_type}`);
          setLoader(true)
          // router.push(`/Inventory-details`); 
        }}>
          {/* {row.action || "view"} */}
          <GoEye size={18} />
        </button>
      ),
    },
  ];

  useEffect(() => {
    resetInventory()
  }, [resetInventory])

  const handlePageChange = (newPage: number, newPerPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    params.set("page_size", newPerPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };


  return (
    <>
      <DynamicTable columns={columns} data={currentData} className="min-w-[1400px]" />

      {/* Pagination Info & Controls */}
      <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {totalCount > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + perPage, totalCount)} of {totalCount} entries
        </div>

        <Pagination
          currentPage={page}
          perPage={perPage}
          totalCount={totalCount}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
}
