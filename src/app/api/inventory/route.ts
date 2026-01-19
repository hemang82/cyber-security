import { CODES } from "@/common/constant";
import { NextResponse } from "next/server";

/**
 * This API is STATIC
 * It will always return same data
 */
export const dynamic = "force-static";

export async function POST() {

    return NextResponse.json({
        code: CODES?.SUCCESS,
        success: true,
        message: "Static Assets API",
        data: [
            {
                // user: {
                //   image: "/images/user/user-17.jpg",
                //   name: "Lindsey Curtis",
                //   role: "Web Designer",
                // },
                // projectName: "Agency Website",
                // team: { images: ["/images/user/user-22.jpg"] },
                // status: "Active",
                // budget: "3.9K",
                assets_name: "Website",
                type: "Web",
                created_at: "2023-10-01",
                scan_status: "2",
                vulnerabilities: { values: ["1", "2", "8", "5", "15"] },
                serverity: "High",
                owner: "ipo-trend.com",
                action: "View",
            },
            {
                // user: {
                //   image: "/images/user/user-17.jpg",
                //   name: "Lindsey Curtis",
                //   role: "Web Designer",
                // },
                // projectName: "Agency Website",
                // team: { images: ["/images/user/user-22.jpg"] },
                // status: "Active",
                // budget: "3.9K",
                assets_name: "Application",
                type: "Web",
                created_at: "2023-10-01",
                scan_status: "1",
                vulnerabilities: { values: ["0", "2", "5", "6", "15"] },
                serverity: "High",
                owner: "",
                action: "View",
            },
        ]
    });

}
