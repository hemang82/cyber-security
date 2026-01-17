import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set("LOGIN_KEY", "", {
        path: "/",
        maxAge: 0, // ❌ delete cookie
    });

    return response;
}

// Suggetion

// const logout = async () => {
//   await fetch("/api/logout", { method: "POST" });
//   router.replace("/signin");
// };
