"use client";

import { CODES } from "@/common/constant";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
// import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const setUser = useAuthStore((s) => s.setUserAuth);
  const clearUserAuth = useAuthStore((s) => s.clearUserAuth);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) return;

        const { code, message, data } = await res.json();

        if (code === CODES?.SUCCESS) {
          setUser({
            is_login: true,
            role: data?.role,
            user: data
          });
        } else {
          clearUserAuth();
        }
      } catch (error) {
        console.error("AuthProvider error:", error);
      }
    };

    fetchUser();
  }, [clearUserAuth, setUser]); // ✅ correct dependency array

  return <>{children}</>;
}
