import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CODES } from "@/common/constant";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";

// export const runtime = "nodejs";

// export async function GET(req: Request) {
//   try {

//     const cookieStore = await cookies();

//     // ✅ DEBUG (once)
//     console.log("REQ COOKIE HEADER:", req.headers.get("cookie"));
//     console.log("ALL COOKIES:", cookieStore.getAll());

//     // Example: read login cookie
//     const isLoggedIn = cookieStore.get(
//       MIDDLEWARE_COOKIE_KEYS.LOGIN_KEY_COOKIE
//     );

//     if (!isLoggedIn) {
//       return NextResponse.json(
//         { code: CODES.ERROR, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Inventory cookie
//     const inventoryCookie = cookieStore.get(
//       MIDDLEWARE_COOKIE_KEYS.INVENTORY_LIST
//     );

//     let inventory: any[] = [];

//     if (inventoryCookie?.value) {
//       inventory = JSON.parse(inventoryCookie.value);
//     }

//     return NextResponse.json({
//       code: CODES.SUCCESS,
//       success: true,
//       data: inventory,
//     });
//   } catch (err) {
//     return NextResponse.json(
//       { code: CODES.ERROR, message: "Failed" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: Request) {
  try {

    // ✅ frontend thi aavelu full body
    const body = await req.json();

    const url = "https://cyberapi.ipotrending.com/api/assets/list";
    console.log("External Backend Call:", { url, method: "POST", body });

    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(body),
      }
    );

    const responseData = await response.json();

    return NextResponse.json({
      code: CODES?.SUCCESS,
      message: responseData?.message,
      success: true,
      data: responseData?.data || responseData,
    });

  } catch (error) {

    return NextResponse.json(
      {
        code: CODES?.ERROR,
        success: false,
        message: "Something went wrong .",
      },
      { status: 500 }
    );
  }
}