"use client"

import { formatDate } from "@/common/commonFunction";
import { DATE_FORMAT } from "@/common/commonVariable";
import DynamicTable from "@/components/tables/DynamicTable";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// export const metadata: Metadata = {
//   title: "Next.js Basic Table | Cyber Admin - Next.js Dashboard Template",
//   description: "This is Next.js Basic Table  page for Cyber Admin  Tailwind CSS Admin Dashboard Template",
//   // other metadata
// };

export default function DominComponent({ resDomainList }: any) {

    const router = useRouter();

    interface Order {
        // vulnerabilities: {
        //     values: string[];
        // }
        domin: string;
        txt_record: string;
        status?: string
    }

    const data: Order[] = [
        {
            domin: "https://ipo-trend.com/",
            txt_record: "asfghjkl1234567890qwertyuiop",
            status: "verified"
        },
        {
            domin: "Domin",
            txt_record: "asfghjkl1234567890qwertyuior",
            status: "pending"
        }
    ];

    const statusClasses: any = {
        pending: "bg-yellow-100 text-yellow-700",
        verified: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };

    const columns = [
        {
            key: "domain",
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
            key: "txt_value",
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
            key: "status",
            title: "Status",
            render: (row: any) => (
                <div>
                    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClasses[row.status?.toLowerCase()] || "bg-gray-100 text-gray-700"} `} >
                        {row.status}
                    </span>
                </div>
            ),
        },
        {
            key: "created_at", title: "Created",
            render: (row: any) => (
                <span>{formatDate(row.created_at, DATE_FORMAT?.FULL_DAY_MONTH_YEAR)}</span>
            ),
        },
    ];

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(50);

    return (<>
        <DynamicTable columns={columns} data={resDomainList} />
        {/* PAGINATION */}
        <Pagination
            currentPage={page}
            perPage={perPage}
            totalCount={resDomainList.length}
            onChange={(newPage, newPerPage) => {
                setPage(newPage);
                setPerPage(newPerPage);
            }}
        />
    </>);
}
