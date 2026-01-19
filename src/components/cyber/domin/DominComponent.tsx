"use client"

import { formatDate } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// export const metadata: Metadata = {
//   title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
//   // other metadata
// };

export default function DominComponent() {

    const router = useRouter();

    interface Order {
        // vulnerabilities: {
        //     values: string[];
        // }
        domin: string;
        txt_record: string;
    }

    const data: Order[] = [
        {
            domin: "https://ipo-trend.com/",
            txt_record: "asfghjkl1234567890qwertyuiop"
        }
    ];

    const columns = [
        {
            key: "domin",
            title: "Domin",
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
            key: "txt_record",
            title: "TXT record",
            // render: (row: any) => (
            //     // <div className="">
            //     //     <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-gray-800 dark:text-gray-200">
            //             {row.txt_record}
            //     //     </span>
            //     // </div>
            // ),
        },
        {
            key: "created_at", title: "Created At",
            render: (row: any) => (
                <span>{formatDate(row.created_at, DATE_FORMAT?.DASH_DD_MM_YYYY)}</span>
            ),
        },
    ];

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(50);

    return (<>

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
    </>);
}
