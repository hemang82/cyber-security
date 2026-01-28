"use client"

import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { useAuthStore } from "@/store/authStore";
import { Metadata } from "next";
import React from "react";

// export const metadata: Metadata = {
//   title: "Next.js Profile | Cyber Admin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Profile page for Cyber Admin - Next.js Tailwind CSS Admin Dashboard Template",
// };

export default function Profile() {

  const authData = useAuthStore((state) => state.authData);
  const { is_login, role, user ,  } = authData ?? { is_login: false, role: "", user: null };

  console.log('useruser',user);
  
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={user} />
          <UserInfoCard user={user} />
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </div>
  );
}
