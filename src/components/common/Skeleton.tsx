import React from "react";

interface SkeletonProps {
  className?: string;
  count?: number;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", count = 1, style }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md ${className}`}
          style={{ minHeight: "1rem", ...style }}
        />
      ))}
    </>
  );
};

export const MetricsSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b pb-3">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-6 dark:border-gray-800 dark:bg-gray-900 mb-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={`px-6 py-5 border-gray-200 dark:border-gray-800 ${index < 5 ? "border-b sm:border-r xl:border-b-0" : ""}`} >
            <div className="mt-2 flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex items-end justify-between gap-2 h-64">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full"
            style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex space-x-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-4 mt-4 overflow-hidden">
        {/* Table Header Skeleton */}
        <div className="hidden lg:grid grid-cols-6 gap-4 py-2 border-b border-gray-50 dark:border-gray-800">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-10" />
        </div>
        {/* Table Rows Skeleton */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="grid grid-cols-2 lg:grid-cols-6 gap-4 py-4 border-b last:border-0 border-gray-50 dark:border-gray-800 items-center">
            <Skeleton className="h-2 w-full lg:w-8" />
            <Skeleton className="h-4 w-full lg:w-48" />
            <Skeleton className="h-6 w-full lg:w-20 rounded-full" />
            <Skeleton className="h-2 w-full lg:w-16" />
            <Skeleton className="h-4 w-full lg:w-32" />
            <div className="flex justify-end lg:justify-start">
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GridSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-6 w-full max-w-2xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 h-full space-y-4">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const DetailsSkeleton: React.FC = () => {
  return (
    <div className="mx-auto max-w-[1800px] p-2 lg:p-4 space-y-6">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-64" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 p-6 rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] h-full space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex items-center gap-8 lg:w-2/3">
              <Skeleton className="h-36 w-36 rounded-full shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
            <div className="xl:w-1/3 flex justify-center">
              <Skeleton className="h-48 w-48 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="xl:col-span-4 p-6 rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] space-y-6">
          <Skeleton className="h-8 w-56" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Secondary Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
            <Skeleton className="h-7 w-40 mb-2" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
      </div>

      {/* Stats Grid Skeleton (5 cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-end justify-between">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card Skeleton */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Skeleton className="h-6 w-48 mb-4 flex items-center gap-2" />
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Skeleton className="h-3 w-12 mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Skeleton className="h-3 w-12 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Skeleton className="h-3 w-12 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Skeleton className="h-3 w-12 mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Table Card Skeleton */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-5 gap-4 border-b pb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 py-2 border-b last:border-0">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-4 w-full mt-3" />
                <Skeleton className="h-4 w-full mt-3" />
                <Skeleton className="h-6 w-full mt-2 rounded-full" />
                <Skeleton className="h-8 w-8 mt-1 rounded-md justify-self-center" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Chart Skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
        <div className="h-80 flex items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1"
              style={{ height: `${20 + Math.random() * 70}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ScanSkeleton: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl p-0 lg:p-4 space-y-10 flex flex-col items-center">
      <div className="relative mb-4">
        <div className="h-40 w-40 rounded-full animate-pulse bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="w-full space-y-4 text-center">
        <div className="flex justify-center">
          <Skeleton className="h-10 w-64 lg:w-96" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-6 w-48 lg:w-80" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/[0.03] flex items-center gap-5">
            <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/[0.03] space-y-8">
        <div className="flex justify-start">
           <Skeleton className="h-4 w-48 mb-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-6">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AddScanSkeleton: React.FC = () => {
  return (
    <div className="mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
        <div className="flex flex-col gap-2">
           <Skeleton className="h-8 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>

      <div className="rounded-2xl border-b border-gray-200 bg-white dark:bg-white/[0.03]">
        <div className="p-4 sm:p-6">
          <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800 space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-px">
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-16 !border-b-2 border-transparent" />
                <Skeleton className="h-10 w-16 !border-b-2 border-transparent" />
                <Skeleton className="h-10 w-16 !border-b-2 border-transparent" />
              </div>
            </div>

            <div className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
