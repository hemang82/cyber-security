"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { TOAST_ERROR, TOAST_SUCCESS } from "@/common/commonFunction";
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "../ui/button/Button";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { InformationModel } from "../ui/modal/InformationModel";
import { WarningModel } from "../ui/modal/WarningModel";
import { SuccessModel } from "../ui/modal/SuccessModel";
import { ErrorModel } from "../ui/modal/ErrorModel";
import { CODES } from "@/common/constant";
import { RiLogoutBoxLine } from "react-icons/ri";

export default function UserDropdown() {
  const router = useRouter();

  const { isOpen, openModal, closeModal } = useModal();

  const [isDropOpen, setIsDropOpen] = useState(false);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) { e.stopPropagation(); setIsDropOpen((prev) => !prev); }

  const authData = useAuthStore((state) => state.authData);
  const { is_login, role, user } = authData ?? { is_login: false, role: "", user: null };

  const clearUserAuth = useAuthStore((state) => state.clearUserAuth);

  function closeDropdown() {
    setIsDropOpen(false);
  }

  const handleLogout = async () => {
    try {
      const data = await fetch("/api/auth/logout", {
        method: "POST",
      });
      clearUserAuth(); // zustand clear
      router.replace("/signin"); // redirect
      TOAST_SUCCESS("Logout Successfully")

    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleModelSave = async () => {
    // Handle save logic here
    console.log("Saving changes...");
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const { code, message, data } = await res.json();
      if (code == CODES?.SUCCESS) {
        clearUserAuth(); // zustand clear
        closeModal();
        router.replace("/signin"); // redirect
        TOAST_SUCCESS("Logout Successfully")
      } else {
        TOAST_ERROR(message)
      }
    } catch (error) {
      console.error("Logout failed", error);
      TOAST_ERROR("Something went wrong")
    }
  };

  return (<>
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle">
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={44}
            height={44}
            src={"/images/user/default-user.webp"}
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">{user?.name}</span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isDropOpen ? "rotate-180" : ""
            }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isDropOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>

          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.name} | {user?.plan} | ({user?.role})
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>

        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                  fill=""
                />
              </svg>
              Edit profile
            </DropdownItem>
          </li>
        </ul>
        <button // href="/signin"
          onClick={openModal}
          // onClick={() => { handleLogout() }}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-semibold text-slate-600 rounded-xl transition-all hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 w-full"
        >
          <RiLogoutBoxLine size={20} className="flex-shrink-0" />
          Logout
        </button>
      </Dropdown>
    </div >

    {typeof document !== "undefined" && isOpen && createPortal(
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <WarningModel
          title="Confirm Logout"
          description="Are you sure you want to log out? You’ll need to sign in again to access your account."
          onClose={closeModal}
          handleModelSave={handleModelSave}
        />
      </Modal>,
      document.body
    )}
  </>
  );
}
