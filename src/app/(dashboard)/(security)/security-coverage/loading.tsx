import React from 'react';
import { GridSkeleton } from '@/components/common/Skeleton';

export default function Loading() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <GridSkeleton />
        </div>
    );
}
