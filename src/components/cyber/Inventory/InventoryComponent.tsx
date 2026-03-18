"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../ui/table";
import Image from "next/image";
import Link from "next/link";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ASSETS_INPUTS } from "./Assets/AddAssets";
import { ASSETS } from "./Assets/AssetsTypes";
import { useInventoryStore } from "@/store";
import { Badge, CyberColorClass, severityColor } from "./assetsDetails/WebsiteDetails";
import { GoEye } from "react-icons/go";

export default function InventoryComponent({ InventoryData }: any) {
  const list = Array.isArray(InventoryData?.assets) ? InventoryData.assets : (Array.isArray(InventoryData) ? InventoryData : []);
  const totalCount = InventoryData?.total_count || list.length;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { setLoader, resetInventory } = useInventoryStore();

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("page_size")) || 15;

  const columns = [
    {
      key: "displayId",
      title: "ID",
      className: "min-w-[70px]",
    },
    {
      key: "name",
      title: "Asset Name",
      className: "min-w-[150px]",
      render: (row: any) => (
        <span title={row?.name} className="block w-full max-w-[200px] truncate">
          {safeText(row?.name)}
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
            {safeText(ASSETS.find((item) => item?.key === row?.type)?.title || "-")}
          </span>
        </div>
      ),
    },
    // {
    //   key: "url",
    //   title: "Website URL",
    //   className: "min-w-[250px]",
    //   render: (row: any) => (
    //     <span title={row?.url} className="block w-full max-w-[250px] truncate">
    //       {row?.url || "N/A"}
    //     </span>
    //   ),
    // },
    {
      key: "scan_count",
      title: "Scan Count",
      className: "min-w-[120px]",
      render: (row: any) => (<>
        {safeText(row?.scan_count || "0")}
      </>),
    },
    {
      key: "finding_count",
      title: "Finding Count",
      className: "min-w-[120px]",
      render: (row: any) => (<>
        {safeText(row?.finding_count || "0")}
      </>),
    },
    {
      key: "created_at", title: "Created At",
      className: "min-w-[150px]",
      render: (row: any) => (
        <span>{formatDate(row?.created_at, DATE_FORMAT?.DASH_DD_MM_YYYY) || "-"}</span>
      ),
    },
    {
      key: "action", title: "Action",
      className: "min-w-[100px]",
      render: (row: any) => (
        <Link
          href={`/scan?assets_id=${encodeURIComponent(row?.id)}&type=${encodeURIComponent(row?.type)}`}
          prefetch={false}
          onClick={() => router.refresh()}
          className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400 shadow-theme-xs inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          <GoEye size={18} />
        </Link>
      ),
    },
  ];

  useEffect(() => {
    resetInventory()
  }, [resetInventory])

  const startIndex = (page - 1) * perPage;

  const handlePageChange = (newPage: number, newPerPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    params.set("page_size", newPerPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentData = list?.map((item: any, index: number) => ({
    ...item,
    displayId: startIndex + index + 1
  })) || [];

  return (
    <>
      <DynamicTable columns={columns} data={currentData} className="min-w-[1100px]" />

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
