import React from "react";
import { AddScanSkeleton } from "@/components/common/Skeleton";

/**
 * Loading state for the Add Scan (Add Asset) page.
 * Displays the specialized skeleton UI to indicate content is being prepared.
 */
export default function Loading() {
  return <AddScanSkeleton />;
}
