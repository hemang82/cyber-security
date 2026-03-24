"use client";
import React from "react";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import { useAuthStore } from "@/store/authStore";

export default function ProfileComponent() {
  const { user } = useAuthStore((state) => state.authData) ?? { user: null };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-3">
        <UserMetaCard user={user} />
      </div>
      <div className="xl:col-span-3">
        <UserInfoCard user={user} />
      </div>
      {/* <div className="xl:col-span-1"> */}
      {/* <UserAddressCard /> */}
      {/* </div> */}
    </div>
  );
}
