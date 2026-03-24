import React from "react";
import { AddScanSkeleton } from "@/components/common/Skeleton";

/**
 * Loading state for the Add Inventory (Add Asset) page.
 * Displays the refined AddScanSkeleton which perfectly matches the initial step.
 */
export default function Loading() {
  return <AddScanSkeleton />;
}
