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

const ComponentCardList: React.FC<ComponentCardProps> = ({
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

  const assets = [
    {
      image: <FaTag className={iconClass} />,
      title: "Total Sales",
      description: "Scan browser-based application hosted online"
    },
    {
      image: <TbReceiptRupee className={iconClass} />,
      title: "Paid",
      description: "Scan browser-based application hosted online"
    },
    {
      image: <HiDocumentCurrencyRupee className={iconClass} />,
      title: "Unpaid",
      description: "Scan browser-based application hosted online"
    },
  ]

  return (<>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {
        assets?.map((assets, index) => {
          return <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-3 hover:border-brand-500 hover:cursor-pointer hover:shadow-lg " key={index}>
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {assets.image}
            </div>

            <div className="flex items-end justify-between ">
              <div>
                <h6 className="mt-2 font-semibold text-gray-800 text-xl text-title-sm dark:text-white/90">
                  {assets.title}
                </h6>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {assets.description}
                </span>
              </div>
            </div>

          </div>
        })
      }
    </div>

    <div className={`rounded-2xl ${title && 'border-b border-gray-200 '}  bg-white dark:bg-white/[0.03] ${className}`} >



      <div className={`flex flex-col justify-between gap-5 ${title && 'border-b border-gray-200'} px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800`}>

        {title && <div>

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

      {/* Card Body */}
      <div className="p-4 dark:border-gray-800 sm:p-6">
        {/* <div className="border-t border-gray-100 dark:border-gray-800"> */}
        <div className="space-y-6">{children}</div>
      </div>

    </div>

    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {false ? "Edit Event" : "Add Event"}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Plan your next big moment: schedule or edit an event to stay on
            track
          </p>
        </div>
        <div className="mt-8">
          <div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Title
              </label>
              <input
                id="event-title"
                type="text"
                // value={title}
                // onChange={(e) => setEventTitle(e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>
          <div className="mt-6">

          </div>

        </div>
        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
          <button
            onClick={closeModal}
            type="button"
            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
          >
            Close
          </button>
          <button
            // onClick={handleAddOrUpdateEvent}
            type="button"
            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
          >
            {false ? "Update Changes" : "Add Event"}
          </button>
        </div>
      </div>
    </Modal>
  </>);
};

export default ComponentCardList;
