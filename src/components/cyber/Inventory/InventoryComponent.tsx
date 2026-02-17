"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../ui/table";
import Image from "next/image";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate, safeText } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { useRouter } from "next/navigation";
import { ASSETS_INPUTS } from "./Assets/AddAssets";
import { assets } from "./Assets/AssetsTypes";
import { useInventoryStore } from "@/store";
import { Badge, CyberColorClass, severityColor } from "./InventoryDetailsComponent";
import { GoEye } from "react-icons/go";

export default function InventoryComponent({ InventoryData }: any) {
  const router = useRouter();

  const { setLoader, resetInventory } = useInventoryStore();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  // Calculate paginated data
  const startIndex = (page - 1) * perPage;
  const currentData = InventoryData?.slice(startIndex, startIndex + perPage).map((item: any, index: number) => ({
    ...item,
    displayId: startIndex + index + 1
  })) || [];

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
          {row?.name || "-"}
        </span>
      ),
    },
    {
      key: "type",
      title: "Type",
      className: "min-w-[150px]",
      render: (row: any) => (
        <div className="">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-gray-800 dark:text-gray-200">
            {assets.find((item) => item?.key === row?.type)?.title || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "url",
      title: "Website URL",
      className: "min-w-[250px]",
      render: (row: any) => (
        <span title={row?.url} className="block w-full max-w-[250px] truncate">
          {row?.url || "N/A"}
        </span>
      ),
    },
    {
      key: "scan_count",
      title: "Scan Count",
      className: "min-w-[120px]",
      render: (row: any) => (<>
        {row?.scan_count || "0"}
      </>),
    },
    {
      key: "finding_count",
      title: "Finding Count",
      className: "min-w-[120px]",
      render: (row: any) => (<>
        {row?.finding_count || "0"}
      </>),
    },
    {
      key: "created_at", title: "Created At",
      className: "min-w-[150px]",
      render: (row: any) => (
        <span>{formatDate(row?.created_at, DATE_FORMAT?.FULL_DAY_MONTH_YEAR) || "-"}</span>
      ),
    },
    {
      key: "action", title: "Action",
      className: "min-w-[100px]",
      render: (row: any) => (
        <button className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400 shadow-theme-xs inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" onClick={() => {
          // setLoader(true);
          router.push(`/scan?domain=${encodeURIComponent(row?.url)}`);
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

  return (
    <>
      <DynamicTable columns={columns} data={currentData} className="min-w-[1100px]" />

      {/* Pagination Info & Controls */}
      <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {InventoryData?.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + perPage, InventoryData?.length || 0)} of {InventoryData?.length || 0} entries
        </div>

        <Pagination
          currentPage={page}
          perPage={perPage}
          totalCount={InventoryData?.length || 0}
          onChange={(newPage, newPerPage) => {
            setPage(newPage);
            setPerPage(newPerPage);
          }}
        />
      </div>
    </>
  );
}
