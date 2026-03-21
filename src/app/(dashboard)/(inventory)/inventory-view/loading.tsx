import React from 'react';
import { DetailsSkeleton } from '@/components/common/Skeleton';

export default function Loading() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <DetailsSkeleton />
        </div>
    );
}
