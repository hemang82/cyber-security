import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ProfileComponent from "@/components/user-profile/ProfileComponent";

export const metadata: Metadata = {
  title: "User Profile | CyberSafe DNS Security",
  description: "View and manage your personal profile, company information, and security preferences.",
};

export const dynamic = "force-dynamic";

export default function Page({ searchParams }: any) {
  return (
    <div className="mx-auto ">
      <PageBreadcrumb pageTitle="Profile" />
      <div className="">
        <ProfileComponent />
      </div>
    </div>
  );
}
