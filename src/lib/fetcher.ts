// lib/fetcher.ts
import { headers } from "next/headers";

/* ✅ DEFINE TYPE */
export type FetcherOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  revalidate?: number;
};

type ApiError = {
  message: string;
  status?: number;
};

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later.";

export async function fetcher(
  url: string,
  options: FetcherOptions = {},
  basePath?: boolean
) {
  const {
    method = "GET",
    body,
    headers: customHeaders,
    cache = "no-store",
    revalidate,
  } = options;

  /* ✅ FIX: await headers() */
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    throw new Error("Host not found in request headers");
  }

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  let fullUrl
  if (basePath) {
    fullUrl = process.env.NEXT_PUBLIC_API_BASE_URL + url
  } else {
    fullUrl = url.startsWith("http")
      ? url
      : `${protocol}://${host}${url}`;
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      cache,
      headers: {
        "Content-Type": "application/json",
        "api-key": "cyber123",
        ...customHeaders,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(revalidate ? { next: { revalidate } } : {}),
    });

    if (!response.ok) {
      console.log("API ERROR", {
        url: fullUrl,
        status: response.status,
      });

      console.log("API ERROR", response.status);

      throw {
        message: DEFAULT_ERROR_MESSAGE,
        status: response.status,
      } as ApiError;
    }

    return await response.json();
  } catch (error) {
    console.log("FETCH ERROR", error);

    throw {
      message: "Unable to process your request. Please try again.",
    } as ApiError;
  }
}
