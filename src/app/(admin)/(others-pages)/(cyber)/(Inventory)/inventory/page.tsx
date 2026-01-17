"use client"
import { formatDate } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { Metadata } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// export const metadata: Metadata = {
//   title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
//   // other metadata
// };

export default function page() {

  const router = useRouter();

  interface Order {
    // user: {
    //   image: string;
    //   name: string;
    //   role: string;
    // };
    // team: { images: string[] };
    // projectName: string;
    // status: string;
    // budget: string;
    assets_name: string;
    type: string;
    created_at: string;
    scan_status: string;
    vulnerabilities: {
      values: string[];
    }
    serverity: string;
    owner: string;
    action: string;
  }

  const data: Order[] = [
    {
      // user: {
      //   image: "/images/user/user-17.jpg",
      //   name: "Lindsey Curtis",
      //   role: "Web Designer",
      // },
      // projectName: "Agency Website",
      // team: { images: ["/images/user/user-22.jpg"] },
      // status: "Active",
      // budget: "3.9K",
      assets_name: "Website",
      type: "Web",
      created_at: "2023-10-01",
      scan_status: "2",
      vulnerabilities: { values: ["1", "2", "8", "5", "15"] },
      serverity: "High",
      owner: "John Doe",
      action: "View",
    },
    {
      // user: {
      //   image: "/images/user/user-17.jpg",
      //   name: "Lindsey Curtis",
      //   role: "Web Designer",
      // },
      // projectName: "Agency Website",
      // team: { images: ["/images/user/user-22.jpg"] },
      // status: "Active",
      // budget: "3.9K",
      assets_name: "Application",
      type: "Web",
      created_at: "2023-10-01",
      scan_status: "1",
      vulnerabilities: { values: ["0", "2", "5", "6", "15"] },
      serverity: "High",
      owner: "",
      action: "View",
    },
    {
      // user: {
      //   image: "/images/user/user-17.jpg",
      //   name: "Lindsey Curtis",
      //   role: "Web Designer",
      // },
      // projectName: "Agency Website",
      // team: { images: ["/images/user/user-22.jpg"] },
      // status: "Active",
      // budget: "3.9K",
      assets_name: "Website",
      type: "Web",
      created_at: "2023-10-01",
      scan_status: "2",
      vulnerabilities: { values: ["1", "2", "8", "5", "15"] },
      serverity: "High",
      owner: "John Doe",
      action: "View",
    },
    {
      // user: {
      //   image: "/images/user/user-17.jpg",
      //   name: "Lindsey Curtis",
      //   role: "Web Designer",
      // },
      // projectName: "Agency Website",
      // team: { images: ["/images/user/user-22.jpg"] },
      // status: "Active",
      // budget: "3.9K",
      assets_name: "Application",
      type: "Web",
      created_at: "2023-10-01",
      scan_status: "1",
      vulnerabilities: { values: ["0", "2", "5", "6", "15"] },
      serverity: "High",
      owner: "",
      action: "View",
    },
  ];

  const columns = [
    {
      key: "assets_name",
      title: "Assets Name",
      // render: (row: Order) => (
      //   <div className="flex items-center gap-3">
      //     <Image
      //       src={row.user.image}
      //       width={40}
      //       height={40}
      //       alt={row.user.name}
      //       className="rounded-full"
      //     />
      //     <div>
      //       <div className="font-medium text-gray-800 dark:text-white/90">
      //         {row.user.name}
      //       </div>
      //       <div className="text-xs text-gray-500">{row.user.role}</div>
      //     </div>
      //   </div>
      // ),
    },
    {
      key: "type",
      title: "Type",
      render: (row: any) => (
        <div className="">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-gray-800 dark:text-gray-200">
            {row.type}
          </span>
        </div>
      ),
    },
    {
      key: "created_at", title: "Created At",
      render: (row: any) => (
        <span>{formatDate(row.created_at, DATE_FORMAT?.DASH_DD_MM_YYYY)}</span>
      ),
    },
    { key: "scan_status", title: "Scans", },
    {
      key: "vulnerabilities", title: "Vulnerabilities", render: (row: any) => (
        <div className="flex flex-wrap gap-2">
          {Array.isArray(row?.vulnerabilities?.values) &&
            row.vulnerabilities.values.length > 0 ? (
            row.vulnerabilities.values.map((item: string, index: number) => (
              <Badge
                key={index}
                size="sm"
                color={Number(item) < 5 ? "error" : Number(item) < 10 ? "warning" : "success"}
              >
                {item}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      ),
    },
    {
      key: "serverity", title: "Serverity",
      render: (row: any) => (
        <Badge size="sm" color={row.serverity === "Active" ? "success" : "warning"}>
          {row.serverity}
        </Badge>
      ),
    },
    { key: "owner", title: "Owner" },
    {
      key: "action", title: "Action",
      render: (row: any) => (
        <button className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400" onClick={() => { router.push(`/Inventory-details`); }}>
          {row.action}
        </button>
      ),
    },
  ];

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  return (

    <div>
      <PageBreadcrumb pageTitle="Inventory" />
      <div className="space-y-6">
        <ComponentCard title="Inventory" buttonName={"Add Inventory"} navigation={"/add-inventory"}>
          <DynamicTable columns={columns} data={data} />
          {/* PAGINATION */}
          <Pagination
            currentPage={page}
            perPage={perPage}
            totalCount={data.length}
            onChange={(newPage, newPerPage) => {
              setPage(newPage);
              setPerPage(newPerPage);
            }}
          />
        </ComponentCard>
      </div>
    </div>

  );
}
