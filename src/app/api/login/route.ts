import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // 🔐 Dummy validation (replace with DB)
  if (email === "admin@gmail.com" && password === "Test@1234") {
    const response = NextResponse.json({
      code: 0,
      success: true,
      message: "Login success",
      data: {
        email: email,
        password: password
      }
    });

    // ✅ AUTH COOKIE SET
    response.cookies.set("LOGIN_KEY", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  }

  return NextResponse.json(
    { code: 0, success: false, message: "Invalid credentials" },
    { status: 401 }
  );
}
