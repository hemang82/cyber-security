"use client"

import { useModal } from "@/hooks/useModal";
import React from "react";
import { FaDownload, FaTag } from "react-icons/fa6";
import { RiAddLargeFill } from "react-icons/ri";
import { Modal } from "../ui/modal";
import { useRouter } from "next/navigation";
import { TfiWorld } from "react-icons/tfi";
import { LuFileCode2 } from "react-icons/lu";
import { AiOutlineCloudServer } from "react-icons/ai";
import { IoCloudOutline } from "react-icons/io5";
import { HiDocumentCurrencyRupee } from "react-icons/hi2";
import { TbReceiptRupee } from "react-icons/tb";

interface ComponentCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  buttonName?: String;
  navigation?: String;
  excel?: Boolean
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  buttonName = null,
  navigation = "/",
  excel = false
}) => {

  const router = useRouter()
  const { isOpen, openModal, closeModal } = useModal();

  const handleSelect = () => {
    if (typeof navigation === "string") {
      router.push(navigation);
    } else {
      openModal();
    }
  };

  let iconClass = 'text-gray-800 size-6 dark:text-white/90'

  return (<>

    <div className={`rounded-2xl ${title && 'border-b border-gray-200 '}  bg-white dark:bg-white/[0.03] ${className}`} >
      {title && <div className={`flex flex-col justify-between gap-5 ${title && 'border-b border-gray-200'} px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800`}>

        {title || desc && <div>

          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>}

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center dark:border-gray-800">


          {excel && <button className="shadow-theme-xs inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]">
            Export <FaDownload />
          </button>}

          {buttonName && <div className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition  cursor-pointer" onClick={() => { handleSelect() }}>
            <RiAddLargeFill /> {buttonName}
          </div>}

        </div>
      </div>
      }
      {/* Card Body */}
      <div className="p-4 dark:border-gray-800 sm:p-6">
        {/* <div className="border-t border-gray-100 dark:border-gray-800"> */}
        <div className="space-y-6">{children}</div>
      </div>

    </div>

  </>);
};

export default ComponentCard;
