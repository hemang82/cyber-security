"use client"

import React, { useEffect, useState, useCallback } from "react";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate, normalizeStatus, safeText, TOAST_ERROR } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { SCAN_STATUS, CODES } from "@/common/constant";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Badge, CyberColorClass } from "../Inventory/assetsDetails/WebsiteDetails";
import { GoEye } from "react-icons/go";
import { ASSETS } from "../Inventory/Assets/AssetsTypes";
import { Modal } from "@/components/ui/modal";
import { InfoIcon } from "@/icons";
import Link from "next/link";
import { TableSkeleton } from "@/components/common/Skeleton";

interface UserScanListProps {
  userId: string;
}

export default function UserScanList({ userId }: UserScanListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [scanHistory, setScanHistory] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScan, setSelectedScan] = useState<any>(null);

  const page = Number(searchParams.get("scan_page")) || 1;
  const perPage = Number(searchParams.get("scan_page_size")) || 10;

  const fetchScans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/scan-history?id=${userId}&page=${page}&page_size=${perPage}`);
      const result = await res.json();
      if (result.code === CODES?.SUCCESS || result.code === 1) {
        setScanHistory(result.data);
      } else {
        TOAST_ERROR(result.message || "Failed to fetch scan history");
      }
    } catch (err) {
      TOAST_ERROR("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [userId, page, perPage]);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const scanList = Array.isArray(scanHistory?.scans) ? scanHistory.scans : (Array.isArray(scanHistory) ? scanHistory : []);
  const totalCount = scanHistory?.total_count || scanList.length;

  const startIndex = (page - 1) * perPage;
  const currentData = scanList.map((item: any, index: number) => ({
    ...item,
    displayId: startIndex + index + 1
  }));

  const columns = [
    {
      key: "displayId",
      title: "ID",
      className: "min-w-[40px]",
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
            {safeText(ASSETS.find((item) => item?.key === row?.asset_type)?.title || "Website")}
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
                {safeText(item?.count)}
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
      key: "scan_purpose",
      title: "Scan Purpose",
      className: "min-w-[150px]",
      render: (row: any) => {
        const purpose = row?.scan_purpose || "manual_scan";
        const isAutomated = purpose === "automated_scan";
        return (
          <div
            onClick={() => {
              setSelectedScan(row);
              setIsModalOpen(true);
            }}
            className="cursor-pointer group flex items-center gap-2"
          >
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${isAutomated
              ? "bg-amber-50 text-amber-600 border border-amber-200 group-hover:bg-amber-100"
              : "bg-blue-50 text-blue-600 border border-blue-200 group-hover:bg-blue-100"
              }`}>
              {/* {isAutomated ? <CalenderIcon className="size-3" /> : <BoltIcon className="size-3" />} */}
              {safeText(purpose === "automated_scan" ? "Automated" : "Manual")}
            </span>
          </div>
        );
      },
    },
    {
      key: "status", title: "Status",
      className: "min-w-[150px]",
      render: (row: any) => {
        const status = normalizeStatus(row?.status);
        const isActive = status === SCAN_STATUS.IN_PROGRESS;
        return (
          <span
            className={`rounded-md px-2 py-0.5 text-sm border font-medium flex items-center gap-2 w-fit ${CyberColorClass[status as keyof typeof CyberColorClass]} `} >
            {isActive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            )}
            {safeText(status?.replace("_", " ")) || "Info"}
          </span>
        );
      },
    },
    {
      key: "action", title: "Action",
      className: "min-w-[100px]",
      render: (row: any) => {
        const rawStatus = (row?.status || "").toUpperCase();
        const status = normalizeStatus(rawStatus);
        const isInProgress = [
          SCAN_STATUS.IN_PROGRESS,
          SCAN_STATUS.PENDING,
          SCAN_STATUS.PROCESSING,
          SCAN_STATUS.QUEUED,
          SCAN_STATUS.INITIALIZING,
          SCAN_STATUS.WAITING,
          "IN PROGRESS" // handling legacy version with space
        ].includes(status) || [
          SCAN_STATUS.IN_PROGRESS,
          SCAN_STATUS.PENDING,
          SCAN_STATUS.PROCESSING,
          SCAN_STATUS.QUEUED,
          SCAN_STATUS.INITIALIZING,
          SCAN_STATUS.WAITING,
          "IN PROGRESS"
        ].includes(rawStatus);

        const isScheduled = status === SCAN_STATUS.SCHEDULED || rawStatus === SCAN_STATUS.SCHEDULED;
        const targetPath = isInProgress ? "/scan-progress" : isScheduled ? "/scan-scheduled" : "/asset-view";

        let href = `${targetPath}?id=${encodeURIComponent(row?.id)}&type=${row?.asset_type}&name=${encodeURIComponent(row?.asset_name || "")}`;

        if (isScheduled) {
          href += `&time=${encodeURIComponent(row?.scheduled_at || "")}&scan_type=${encodeURIComponent(row?.scan_type || "")}`;
        }

        return (<>
          <Link
            href={href}
            prefetch={false}
            onClick={() => router.refresh()}
            className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400 shadow-theme-xs inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <GoEye size={18} />
          </Link>
        </>);
      },
    },
  ];

  const handlePageChange = (newPage: number, newPerPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("scan_page", newPage.toString());
    params.set("scan_page_size", newPerPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6">

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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[500px]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
              <InfoIcon className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Scan Details</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Scan Type</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white capitalize">
                  {safeText(selectedScan?.scan_type?.replace('_', ' ') || "N/A")}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Scheduled At</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  {selectedScan?.scheduled_at ? formatDate(selectedScan.scheduled_at, DATE_FORMAT?.FULL_DAY_MONTH_YEAR) : "Immediate"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20">
              <div className="flex items-center gap-2 mb-2">
                <div className={`size-2 rounded-full ${selectedScan?.scan_purpose === 'automated_scan' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Execution Strategy</p>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {selectedScan?.scan_purpose === 'automated_scan'
                  ? "This scan was scheduled to run automatically at the specified time."
                  : "This scan was initiated manually by the user."}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
