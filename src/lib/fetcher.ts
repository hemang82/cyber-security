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
  options: FetcherOptions = {}
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

  const fullUrl = url.startsWith("http")
    ? url
    : `${protocol}://${host}${url}`;

  try {
    const response = await fetch(fullUrl, {
      method,
      cache,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY!,
        ...customHeaders,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(revalidate ? { next: { revalidate } } : {}),
    });

    if (!response.ok) {
      console.error("API ERROR", {
        url: fullUrl,
        status: response.status,
      });

      throw {
        message: DEFAULT_ERROR_MESSAGE,
        status: response.status,
      } as ApiError;
    }

    return await response.json();
  } catch (error) {
    console.error("FETCH ERROR", error);

    throw {
      message: "Unable to process your request. Please try again.",
    } as ApiError;
  }
}
