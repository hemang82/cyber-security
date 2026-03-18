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
      <div className="space-y-4 mt-4">
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
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-2 lg:grid-cols-6 gap-4 py-4 border-b last:border-0 border-gray-50 dark:border-gray-800">
            <Skeleton className="h-4 w-full lg:w-10" />
            <Skeleton className="h-4 w-full lg:w-48" />
            <Skeleton className="h-4 w-full lg:w-24" />
            <Skeleton className="h-4 w-full lg:w-24" />
            <Skeleton className="h-4 w-full lg:w-20" />
            <div className="flex justify-end lg:justify-start">
              <Skeleton className="h-8 w-8 rounded-lg" />
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-end justify-between">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Skeleton className="h-6 w-48 mb-4 flex items-center gap-2" />
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
