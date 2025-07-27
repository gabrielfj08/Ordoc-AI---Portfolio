/**
 * PolicyActions CheckboxGroup Skeleton Component
 * Migrated from PrinterCloud PolicyActions/CheckboxGroup/Skeleton.tsx (Arquivo 20/51)
 * 
 * Enhanced version with detailed skeleton structure vs original single skeleton
 * Original: <Skeleton h={10} w="full" rounded="md" />
 * Migrated: Multiple skeleton elements for realistic loading state
 */

'use client';

import * as React from 'react';

interface PolicyActionsCheckboxGroupSkeletonProps {
  compact?: boolean; // Option for simple skeleton like original
  itemCount?: number; // Number of skeleton items to show
}

const PolicyActionsCheckboxGroupSkeleton = ({ 
  compact = false, 
  itemCount = 4 
}: PolicyActionsCheckboxGroupSkeletonProps = {}) => {
  // Compact mode matches the original PrinterCloud component
  if (compact) {
    return (
      <div className="h-10 w-full bg-gray-300 rounded-md animate-pulse" />
    );
  }

  // Enhanced mode with detailed skeleton structure
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
      </div>

      {/* Actions skeleton */}
      <div className="space-y-3">
        {[...Array(itemCount)].map((_, index) => (
          <div
            key={index}
            className="flex items-center p-4 border border-gray-200 rounded-lg"
          >
            {/* Checkbox skeleton */}
            <div className="w-5 h-5 bg-gray-300 rounded border mr-3 animate-pulse"></div>
            
            {/* Icon skeleton */}
            <div className="w-8 h-8 bg-gray-300 rounded mr-3 animate-pulse"></div>
            
            {/* Content skeleton */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded-full w-16 animate-pulse"></div>
              </div>
              <div className="h-3 bg-gray-300 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyActionsCheckboxGroupSkeleton;
