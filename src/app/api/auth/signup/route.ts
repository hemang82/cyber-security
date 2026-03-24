import { CODES, BACKEND_STATUS } from "@/common/constant";
import { handleBackendResponse } from "@/common/api-handler";
import { MIDDLEWARE_COOKIE_KEYS } from "@/common/middleware.constants";
import { setCookie } from "@/common/middleware.function";
import { NextResponse } from "next/server";

const DefaultUser = {
  name: "Admin",
  role: "admin",
  profile_image: "https://jain-fintech-assets.s3.us-east-1.amazonaws.com/profile_image/1747048240510.webp",
  email: "admin@gmail.com",
  password: "Admin@123",
  phone_number: "1234567891"
}

// export async function POST(request: Request) {

//   const body = await request.json();

//   const { email, password } = body;

//   if (email === DefaultUser?.email && password === DefaultUser?.password) {
//     const response = NextResponse.json({
//       code: CODES?.SUCCESS,
//       // success: true,
//       message: "Login success",
//       data: {
//         email: email,
//         password: password
//       }
//     });

// setCookie(response, MIDDLEWARE_COOKIE_KEYS.LOGIN_KEY_COOKIE, true)
// setCookie(response, MIDDLEWARE_COOKIE_KEYS.AUTH_KEY_COOKIE, DefaultUser)
// setCookie(response, MIDDLEWARE_COOKIE_KEYS.ROLE_KEY_COOKIE, DefaultUser?.role)

//     return response;
//   }

//   return NextResponse.json(
//     { code: CODES?.ERROR, message: "Invalid credentials" },
//     { status: 401 }
//   );
// }


export async function POST(req: Request) {
  try {

    const body = await req.json();

    // ✅ External API call (body direct forward)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // 👈 DIRECT PASS
        cache: "no-store",
      }
    );


    const data = await response.json();
    return handleBackendResponse(data, { defaultErrorMsg: "Registration failed" });

  } catch (error) {

    console.error("Domain Add API Error:", error);

    return NextResponse.json({
      code: CODES?.ERROR,
      success: false,
      message: "Something went wrong .",
    }, { status: 500 });
  }
}
