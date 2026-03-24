import React from 'react';
import { ScanSkeleton } from '@/components/common/Skeleton';

export default function Loading() {
    return (
        <div className="p-2 lg:p-4">
            <ScanSkeleton />
        </div>
    );
}
