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
import { Badge, CyberColorClass, severityColor } from "./InventoryDetailsComponent";
import { GoEye } from "react-icons/go";
import { assets } from "./Assets/AssetsTypes";

export default function ScanComponent({ ScanHistory }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { setLoader, resetInventory } = useInventoryStore();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  // const [selectedDomain, setSelectedDomain] = useState("");
  const selectedDomain = searchParams.get("domain")?.toString() || "";

  const [selectedType, setSelectedType] = useState("");

  // Extract unique domains and types for filters
  const uniqueDomains = Array.from(new Set(ScanHistory?.map((item: any) => item.target_url))).filter(Boolean);
  const uniqueTypes = Array.from(new Set(ScanHistory?.map((item: any) => item.type))).filter(Boolean);

  // Filter data based on selected domain and type
  const filteredData = ScanHistory.filter((item: any) => {
    const matchesDomain = selectedDomain ? item.target_url === selectedDomain : true;
    const matchesType = selectedType ? item.type === selectedType : true;
    return matchesDomain && matchesType;
  });

  // Calculate paginated data
  const startIndex = (page - 1) * perPage;
  const currentData = filteredData.slice(startIndex, startIndex + perPage).map((item: any, index: number) => ({
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
      key: "type",
      title: "Type",
      className: "min-w-[150px]",
      render: (row: any) => (
        <div className="">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-gray-800 dark:text-gray-200">
            {assets.find((item) => item?.key === row?.type)?.title || "Website"}
          </span>
        </div>
      ),
    },
    {
      key: "website_url",
      title: "Website URL",
      className: "min-w-[300px]",
      render: (row: any) => (
        <span title={row?.target_url} className="block w-full max-w-[300px] truncate">
          {row?.target_url}
        </span>
      ),
    },
    {
      key: "vulnerabilities",
      title: "Vulnerabilities",
      className: "min-w-[220px]",
      render: (row: any) => {
        // console.log("Row Data 👉", row); // 👈 row structure અહીં દેખાશે

        const vulnerabilities = row?.full_response?.finding_counts;

        return (
          <div className="flex flex-wrap gap-2">
            {vulnerabilities?.map((item: any, index: number) => (
              <Badge key={index} color={item?.color} classname="!text-xs ">
                {item?.count}
              </Badge>
            ))}
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

        {safeText(row?.full_response?.output_score) || "Info"}
      </>),
    },
    {
      key: "serverity", title: "Serverity",
      className: "min-w-[150px]",
      render: (row: any) => (
        // <Badge size="sm" color={row.risk_level && severityColor(row.risk_level) || '12'}>
        //   {row.risk_level || "Warning"}
        // </Badge>

        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${CyberColorClass[row?.risk_color as keyof typeof CyberColorClass]} `} >
          {safeText(row?.risk_level) || "Info"}
        </span>
      ),
    },
    {
      key: "created_at", title: "Created At",
      className: "min-w-[150px]",
      render: (row: any) => (
        <span>{formatDate(row?.scanned_at, DATE_FORMAT?.FULL_DAY_MONTH_YEAR)}</span>
      ),
    },
    {
      key: "action", title: "Action",
      className: "min-w-[100px]",
      render: (row: any) => (
        <button className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400 shadow-theme-xs inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200" onClick={() => {
          router.push(`/asset-view?id=${encodeURIComponent(row?.id)}`);
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

  // Handle filter changes
  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const term = e.target.value;
    // setSelectedDomain(e.target.value);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("domain", term);
    } else {
      params.delete("domain");
    }
    router.replace(`${pathname}?${params.toString()}`);
    setPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setPage(1);
  };

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row items-center gap-4">
        {/* Domain Filter */}
        <div className="w-full md:max-w-xs">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Domain
          </label>
          <div className="relative">
            <select
              value={selectedDomain}
              onChange={handleDomainChange}
              className="cursor-pointer w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            >
              <option value="">All Domains</option>
              {uniqueDomains.map((domain: any, index: number) => (
                <option key={index} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Type Filter */}
        <div className="w-full md:max-w-xs">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Type
          </label>
          <div className="relative">
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="cursor-pointer w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            >
              <option value="">All Types</option>
              {/* uniqueTypes */}
              {uniqueTypes.map((type: any, index: number) => (
                <option key={index} value={type}>
                  {assets.find((item) => item?.key === type)?.title || type}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <DynamicTable columns={columns} data={currentData} className="min-w-[1400px]" />

      {/* Pagination Info & Controls */}
      <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + perPage, filteredData.length)} of {filteredData.length} entries
        </div>

        <Pagination
          currentPage={page}
          perPage={perPage}
          totalCount={filteredData.length}
          onChange={(newPage, newPerPage) => {
            setPage(newPage);
            setPerPage(newPerPage);
          }}
        />
      </div>
    </>
  );
}
