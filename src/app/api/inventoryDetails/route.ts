import { CODES } from "@/common/constant";
import { NextResponse } from "next/server";

/**
 * This API is STATIC
 * It will always return same data
 */

// export const dynamic = "force-static";

export async function POST(req: Request) {
  try {

    // ✅ frontend thi aavelu full body
    const body = await req.json();

    console.log("Incoming body:", body);

    // // (optional) empty body check
    // if (!body || Object.keys(body).length === 0) {
    //   return NextResponse.json(
    //     {
    //       code: CODES?.ERROR,
    //       success: false,
    //       message: "Request body is required",
    //     },
    //     { status: 400 }
    //   );
    // }

    // ✅ External API call (body direct forward)
    const response = await fetch("http://cyberapi.tracewavetransparency.com/api/scan/website",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // 👈 DIRECT PASS
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("External API failed");
    }

    const data = await response.json();

    return NextResponse.json({
      code: CODES?.SUCCESS,
      message: data?.message,
      success: true,
      data: data?.data,
    });

  } catch (error) {
    return NextResponse.json(
      {
        code: CODES?.ERROR,
        success: false,
        message: "Something went wrong while scanning website",
      },
      { status: 500 }
    );
  }
}

// export async function GET() {

//   return NextResponse.json({
//     success: true,
//     message: "Static Assets API",
//     data: {
//       "target": "https://ipo-trend.com",
//       "scan_context": "Standard Website",
//       "scanned_at": "2026-01-09T09:32:57.801Z",
//       "security_score": 0,
//       "risk_level": "High Risk",
//       "risk_color": "Red",
//       "summary": {
//         "risk_level": "High Risk",
//         "score": 0,
//         "valid_ssl": true,
//         "days_remaining": 39,
//         "open_ports": 3,
//         "blacklisted": false
//       },
//       "findings": [
//         {
//           "type": "Insecure Remote Access",
//           "severity": "High",
//           "detail": "Port 22 is open (SSH - Risk of Brute Force)"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         },
//         {
//           "owasp": "A02: Cryptographic Failures",
//           "type": "Missing HSTS",
//           "severity": "Medium",
//           "detail": "HTTP Strict Transport Security header is missing.",
//           "evidence": "Header not found"
//         },
//         {
//           "owasp": "A02: Cryptographic Failures",
//           "type": "Information Leakage",
//           "severity": "Low",
//           "detail": "Server version or technology headers are exposed.",
//           "evidence": "Server: nginx, X-Powered-By: N/A"
//         },
//         {
//           "owasp": "A04: Insecure Design",
//           "type": "Missing Rate Limiting Headers",
//           "severity": "Low",
//           "detail": "No rate limiting headers (X-RateLimit) found. Site might be vulnerable to Brute Force/DoS.",
//           "evidence": "Headers checked: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After"
//         },
//         {
//           "owasp": "A04: Insecure Design",
//           "type": "Business Logic verification needed",
//           "severity": "Info",
//           "detail": "Automated scanners cannot fully verify business logic (e.g. price manipulation, workflow bypass).",
//           "evidence": "Manual review required.",
//           "manual_check": true
//         },
//         {
//           "owasp": "A05: Security Misconfiguration",
//           "type": "Missing Content-Security-Policy",
//           "severity": "Low",
//           "detail": "CSP header is missing.",
//           "evidence": "Header not found"
//         },
//         {
//           "owasp": "A05: Security Misconfiguration",
//           "type": "Clickjacking Risk",
//           "severity": "Medium",
//           "detail": "X-Frame-Options header missing.",
//           "evidence": "Header not found"
//         },
//         {
//           "owasp": "A05: Security Misconfiguration",
//           "type": "Missing X-Content-Type-Options",
//           "severity": "Low",
//           "detail": "X-Content-Type-Options: nosniff header missing.",
//           "evidence": "Header not found"
//         },
//         {
//           "owasp": "A06: Vulnerable and Outdated Components",
//           "type": "Server Version Disclosed",
//           "severity": "Low",
//           "detail": "Server banner exposed: nginx.",
//           "evidence": "Header: nginx"
//         },
//         {
//           "owasp": "A09: Security Logging and Monitoring Failures",
//           "type": "Missing Monitoring Headers",
//           "severity": "Low",
//           "detail": "No 'Report-To' or 'NEL' headers found. Client-side security logging might be absent.",
//           "evidence": "Headers missing"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /admin is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/admin"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /administrator is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/administrator"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /dashboard is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/dashboard"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /backup is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/backup"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /db is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/db"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /config is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/config"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.env is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.env"
//         },
//         {
//           "owasp": "A01: Broken Access Control",
//           "type": "Forceful Browsing / Exposed Path",
//           "severity": "High",
//           "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//           "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//         }
//       ],
//       "compliance": {
//         "owasp_top_10": {
//           "A01: Broken Access Control": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ],
//           "A02: Cryptographic Failures": [
//             {
//               "Cryptographic-WASC-13": {
//                 "overallAssessment": "SECURE",
//                 "testResults": [
//                   {
//                     "test": "Certificate Validity",
//                     "status": "SECURE",
//                     "evidence": "Expires in 39 days"
//                   },
//                   {
//                     "test": "Protocol Support",
//                     "status": "SECURE",
//                     "evidence": "TLSv1.3"
//                   }
//                 ]
//               }
//             }
//           ],
//           "A03: Injection": "Passed",
//           "A04: Insecure Design": [
//             {
//               "owasp": "A04: Insecure Design",
//               "type": "Missing Rate Limiting Headers",
//               "severity": "Low",
//               "detail": "No rate limiting headers (X-RateLimit) found. Site might be vulnerable to Brute Force/DoS.",
//               "evidence": "Headers checked: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After"
//             },
//             {
//               "owasp": "A04: Insecure Design",
//               "type": "Business Logic verification needed",
//               "severity": "Info",
//               "detail": "Automated scanners cannot fully verify business logic (e.g. price manipulation, workflow bypass).",
//               "evidence": "Manual review required.",
//               "manual_check": true
//             }
//           ],
//           "A05: Security Misconfiguration": [
//             {
//               "owasp": "A05: Security Misconfiguration",
//               "type": "Missing Content-Security-Policy",
//               "severity": "Low",
//               "detail": "CSP header is missing.",
//               "evidence": "Header not found"
//             },
//             {
//               "owasp": "A05: Security Misconfiguration",
//               "type": "Clickjacking Risk",
//               "severity": "Medium",
//               "detail": "X-Frame-Options header missing.",
//               "evidence": "Header not found"
//             },
//             {
//               "owasp": "A05: Security Misconfiguration",
//               "type": "Missing X-Content-Type-Options",
//               "severity": "Low",
//               "detail": "X-Content-Type-Options: nosniff header missing.",
//               "evidence": "Header not found"
//             }
//           ],
//           "A06: Vulnerable and Outdated Components": [
//             {
//               "owasp": "A06: Vulnerable and Outdated Components",
//               "type": "Server Version Disclosed",
//               "severity": "Low",
//               "detail": "Server banner exposed: nginx.",
//               "evidence": "Header: nginx"
//             }
//           ],
//           "A07: Identification and Authentication Failures": "Passed",
//           "A08: Software and Data Integrity Failures": "Passed",
//           "A09: Security Logging and Monitoring Failures": [
//             {
//               "owasp": "A09: Security Logging and Monitoring Failures",
//               "type": "Missing Monitoring Headers",
//               "severity": "Low",
//               "detail": "No 'Report-To' or 'NEL' headers found. Client-side security logging might be absent.",
//               "evidence": "Headers missing"
//             }
//           ],
//           "A10: Server-Side Request Forgery (SSRF)": "Passed"
//         }
//       },
//       "website_security": {
//         "ssl_certificate": {
//           "valid": true,
//           "days_remaining": 39
//         },
//         "security_headers": {
//           "strict-transport-security": {
//             "status": "Missing",
//             "severity": "Warning"
//           },
//           "content-security-policy": {
//             "status": "Missing",
//             "severity": "Medium"
//           },
//           "x-frame-options": {
//             "status": "Missing",
//             "severity": "Warning"
//           },
//           "x-xss-protection": {
//             "status": "Missing",
//             "severity": "Info"
//           },
//           "x-content-type-options": {
//             "status": "Missing",
//             "severity": "Warning"
//           },
//           "referrer-policy": {
//             "status": "Missing",
//             "severity": "Info"
//           },
//           "permissions-policy": {
//             "status": "Missing",
//             "severity": "Info"
//           },
//           "server_info": "nginx",
//           "x-powered-by": "Hidden"
//         },
//         "technologies": [
//           "nginx",
//           "React"
//         ]
//       },
//       "network_info": {
//         "host": "ipo-trend.com",
//         "open_ports": [
//           {
//             "port": 22,
//             "status": "Open"
//           },
//           {
//             "port": 80,
//             "status": "Open"
//           },
//           {
//             "port": 443,
//             "status": "Open"
//           }
//         ],
//         "findings": [
//           {
//             "type": "Insecure Remote Access",
//             "severity": "High",
//             "detail": "Port 22 is open (SSH - Risk of Brute Force)"
//           }
//         ],
//         "dns_records": {
//           "A": [
//             "3.7.87.128"
//           ],
//           "MX": [
//             {
//               "exchange": "mx1.improvmx.com",
//               "priority": 10
//             },
//             {
//               "exchange": "mx2.improvmx.com",
//               "priority": 20
//             }
//           ],
//           "TXT": [
//             "yandex-verification: ee3129ee6bd38626",
//             "autosect-site-verification-f5g6QEbfNUoghAN05dxA4JSY3E2TorE6wwOZIB4V",
//             "v=spf1 include:spf.improvmx.com ~all",
//             "verify-842397677bf2b4ea7b14a7f9010b75f5"
//           ],
//           "NS": [
//             "ns1.dns-parking.com",
//             "ns2.dns-parking.com"
//           ],
//           "dnssec": "Unknown (Requires advanced query)"
//         },
//         "whois": {
//           "expiry": "2028-10-14T13:05:33Z",
//           "registrar": "GoDaddy.com, LLC",
//           "raw_partial": "   Domain Name: IPO-TREND.COM\r\n   Registry Domain ID: 2925238855_DOMAIN_COM-VRSN\r\n   Registrar WHOIS..."
//         }
//       },
//       "seo_check": {
//         "robots_txt": "Found",
//         "sitemap_xml": "Found"
//       },
//       "performance": {
//         "load_time_ms": 126,
//         "page_size_kb": "4.34",
//         "status": "Good",
//         "script_analysis": {
//           "inline_script_count": 1,
//           "external_script_count": 1,
//           "risky_external_scripts": [],
//           "large_files_count": 0
//         }
//       },
//       "route_scans": [
//         {
//           "url": "https://ipo-trend.com/",
//           "vulnerabilities": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ]
//         },
//         {
//           "url": "https://ipo-trend.com/google-sitemap/ipo",
//           "vulnerabilities": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ]
//         },
//         {
//           "url": "https://ipo-trend.com/google-sitemap/news",
//           "vulnerabilities": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ]
//         },
//         {
//           "url": "https://ipo-trend.com/google-sitemap/broker",
//           "vulnerabilities": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ]
//         },
//         {
//           "url": "https://ipo-trend.com/live",
//           "vulnerabilities": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ]
//         },
//         {
//           "url": "https://ipo-trend.com/upcoming",
//           "vulnerabilities": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ]
//         },
//         {
//           "url": "https://ipo-trend.com/news/1",
//           "vulnerabilities": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ]
//         },
//         {
//           "url": "https://ipo-trend.com/news/2",
//           "vulnerabilities": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ]
//         },
//         {
//           "url": "https://ipo-trend.com/about-us",
//           "vulnerabilities": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ]
//         },
//         {
//           "url": "https://ipo-trend.com/contactUs",
//           "vulnerabilities": [
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /admin is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/admin"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /administrator is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/administrator"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /dashboard is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/dashboard"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /backup is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/backup"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /db is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/db"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /config is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/config"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.env is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.env"
//             },
//             {
//               "owasp": "A01: Broken Access Control",
//               "type": "Forceful Browsing / Exposed Path",
//               "severity": "High",
//               "detail": "Sensitive path /.git/HEAD is accessible without authentication.",
//               "evidence": "Found: https://ipo-trend.com/.git/HEAD"
//             }
//           ]
//         }
//       ]
//     },
//   });

// }
