"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Image from "next/image";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import { formatDate } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import { useRouter } from "next/navigation";

import { useInventoryStore } from "@/store";
import { ASSETS_INPUTS } from "@/components/cyber/Inventory/Assets/AddAssets";
import { assets } from "@/components/cyber/Inventory/Assets/AssetsTypes";

export default function PartyComponent({ partyList }: any) {
  const router = useRouter();

  const { setLoader } = useInventoryStore();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  const columns = [
    {
      key: "id",
      title: "ID",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          {row?.id}
        </div>
      ),
    },
    {
      key: "name",
      title: "Name",
      // render: (row: any) => (
      //   <div className="">
      //     <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-gray-800 dark:text-gray-200">
      //       {row?.name}
      //       {/* {assets.find((item: any) => item?.key === row.assets_type?.value)?.title} */}
      //     </span>
      //   </div>
      // ),
    },
    {
      key: "phone_number",
      title: "Phone number",
      render: (row: any) => (<>
        {row?.phone_number}
      </>),
    },
    {
      key: "gst_number", title: "GST number"
    },
    {
      key: "created_at", title: "Created At",
      render: (row: any) => (
        <span>{formatDate(row.created_at, DATE_FORMAT?.FULL_DAY_MONTH_YEAR)}</span>
      ),
    },
    {
      key: "action", title: "Action",
      render: (row: any) => (
        <button className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400" onClick={() => {
          router.push(`/edit-parties?id=30`);
          // setLoader(true)
          // router.push(`/Inventory-details`); 
        }}>
          {row.action || "Edit"}
        </button>
      ),
    },
  ];

  console.log('partyListpartyList', partyList);

  return (
    <>
      <DynamicTable columns={columns} data={partyList} />
      {/* PAGINATION */}
      <Pagination
        currentPage={page}
        perPage={perPage}
        totalCount={partyList}
        onChange={(newPage, newPerPage) => {
          setPage(newPage);
          setPerPage(newPerPage);
        }}
      />
    </>
  );
}
