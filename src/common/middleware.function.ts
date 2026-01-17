import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type SetCookieOptions = {
    httpOnly?: boolean;
    maxAge?: number;
};

export function setCookie(response: NextResponse, key: string, value: any, options?: SetCookieOptions) {
    response.cookies.set(key, JSON.stringify(value), {
        httpOnly: options?.httpOnly ?? true,
        path: "/",
        maxAge: options?.maxAge ?? 60 * 60 * 24 * 2,
    });
}

/**
 * Universal cookie reader
 * - Middleware → pass request
 * - API Route → don't pass request
 */

export async function getCookie<T = any>(
  key: string,
  request?: NextRequest
): Promise<T | null> {
  try {
    const value = request
      ? request.cookies.get(key)?.value           // middleware (sync)
      : (await cookies()).get(key)?.value;        // API route (async)

      console.log('value',value);
      
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}