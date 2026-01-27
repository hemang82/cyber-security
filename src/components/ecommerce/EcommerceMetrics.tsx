"use client";

import React, { useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, PageIcon } from "@/icons";
import { ImLink } from "react-icons/im";
import { useRouter } from "next/navigation";
import CONSTENT from "@/common/constant";
import { FaUserFriends } from "react-icons/fa";
import { LuFileSearch } from "react-icons/lu";
import { FaRegLightbulb, FaStar } from "react-icons/fa6";
import { GrDocumentLocked } from "react-icons/gr";
import { RiErrorWarningLine } from "react-icons/ri";
import { AiOutlineFileSync } from "react-icons/ai";
import { MdCenterFocusWeak } from "react-icons/md";
import { BiErrorAlt } from "react-icons/bi";
import { SiTicktick } from "react-icons/si";

type Period = "weekly" | "monthly" | "yearly";

export const EcommerceMetrics = () => {

  // const router = useRouter();

  // useEffect(() => {
  //   const is_login = localStorage.getItem(CONSTENT.LOGIN_KEY);

  //   if (!is_login) {
  //     router.replace("/signin");
  //   }
  // }, []);

  const [selected, setSelected] = useState<Period>("weekly");

  const tabClass = (tab: Period) =>
    `text-theme-sm w-full rounded-md px-3 py-2 font-medium transition
     ${selected === tab
      ? "shadow-theme-xs bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    }`;


  return (<>

    <div className="grid rounded-2xl  border-gray-200  sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-gray-900 gap-4">
      {[
        { title: "Total Vulnerabilities", value: "10", icon: <FaRegLightbulb className="text-brand-500 size-5 dark:text-white/90" /> },
        { title: "Scan", value: "10", icon: <LuFileSearch className="text-brand-500 size-5 dark:text-white/90" /> },
        { title: "User", value: "10", icon: <FaUserFriends className="text-brand-500 size-5 dark:text-white/90" /> },
        { title: "Domin", value: "10", icon: <ImLink className="text-brand-500 size-5 dark:text-white/90" /> },
      ].map((item, index) => (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6" key={index}>

          <div className="mt-2 flex items-center gap-4 mb-3">
            {/* ⭐ Small Icon */}
            <div className="flex items-center justify-center w-10 h-10 bg-brand-100 rounded-xl dark:bg-gray-800 ">
              {item.icon}
            </div>

            <span className="text-md font-medium text-gray-500 dark:text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis ">
              {item.title}
            </span>
          </div>

          <h4 className="text-title-xs sm:text-title-sm font-medium text-gray-700 dark:text-white/90">
            {item.value}
          </h4>

        </div>
      ))}
    </div>

    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Metrics
        </h3>
      </div>

      {/* Stats */}
      <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-6 dark:border-gray-800 dark:bg-gray-900 mb-3">
        {[
          { title: "Total Vulnerabilities", value: "0", icon: <GrDocumentLocked className="text-yellow-500 text-sm shrink-0 size-5" /> },
          { title: "Fixed", value: "0", icon: <SiTicktick className="text-green-500 text-sm shrink-0 size-5" /> },
          { title: "Not Fixed", value: "0", icon: <RiErrorWarningLine className="text-red-500 text-sm shrink-0 size-5" /> },
          { title: "Ready To Revalidate", value: "0", icon: <AiOutlineFileSync className="text-blue-500 text-sm shrink-0 size-5" /> },
          { title: "Out of Scope", value: "0", icon: <MdCenterFocusWeak className="text-yellow-500 text-sm shrink-0 size-5" /> },
          { title: "Exception", value: "0", icon: <BiErrorAlt className="text-pink-500 text-sm shrink-0 size-5" /> },
        ].map((item, index) => (
          <div key={index} className={`px-6 py-5 border-gray-200 dark:border-gray-800 ${index < 5 ? "border-b sm:border-r xl:border-b-0" : ""}`} >
            <div className="mt-2 flex items-center gap-2 mb-2">
              {/* ⭐ Small Icon */}
              {item.icon}

              <span className="text-sm text-gray-500 dark:text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis">
                {item.title}
              </span>
            </div>
            <h4 className="text-title-xs sm:text-title-sm font-medium text-gray-800 dark:text-white/90">
              {item.value}
            </h4>
          </div>
        ))}
      </div>


      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ImLink className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Cash + Balance
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              5,359
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
        </div>
      </div>
    </div>
  </>);
};
