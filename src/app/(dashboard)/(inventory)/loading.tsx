import React from 'react';
import { TableSkeleton } from '@/components/common/Skeleton';

export default function Loading() {
    return (
        <div className="p-2 md:p-4">
            <TableSkeleton />
        </div>
    );
}
