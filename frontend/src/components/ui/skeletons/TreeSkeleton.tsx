import { Skeleton } from '@/components/ui/skeleton';

interface TreeSkeletonProps {
  depth?: number;
  items?: number;
  showIcons?: boolean;
}

/**
 * Skeleton placeholder for tree/hierarchical layouts
 * Used for directory navigation and file browsers
 *
 * @param depth - Maximum nesting depth (default: 3)
 * @param items - Number of items per level (default: 5)
 * @param showIcons - Whether to show icon placeholders (default: true)
 */
export function TreeSkeleton({
  depth = 3,
  items = 5,
  showIcons = true
}: TreeSkeletonProps) {
  const renderTreeLevel = (currentDepth: number, indent: number = 0): JSX.Element => {
    if (currentDepth > depth) return <></>;

    const itemCount = Math.max(1, items - currentDepth);

    return (
      <>
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={`tree-${currentDepth}-${i}`}>
            {/* Tree Item */}
            <div
              className="flex items-center gap-2 py-2"
              style={{ paddingLeft: `${indent * 24}px` }}
            >
              {/* Expand/Collapse Icon */}
              {currentDepth < depth && (
                <Skeleton className="h-4 w-4 rounded-sm" />
              )}

              {/* Item Icon */}
              {showIcons && (
                <Skeleton className="h-5 w-5 rounded" />
              )}

              {/* Item Label */}
              <Skeleton
                className="h-5"
                style={{
                  width: `${Math.random() * 40 + 30}%`
                }}
              />

              {/* Item Metadata (size, date, etc.) */}
              {currentDepth === 1 && i % 2 === 0 && (
                <Skeleton className="h-4 w-16 ml-auto" />
              )}
            </div>

            {/* Nested Children (recursively) */}
            {currentDepth < depth && i < 2 && (
              <div className="border-l border-gray-200 ml-2">
                {renderTreeLevel(currentDepth + 1, indent + 1)}
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="space-y-1">
      {/* Tree Header/Toolbar */}
      <div className="flex items-center gap-2 pb-3 border-b mb-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 flex-1 max-w-xs" />
        <Skeleton className="h-8 w-24 ml-auto" />
      </div>

      {/* Tree Structure */}
      <div className="space-y-1">
        {renderTreeLevel(1, 0)}
      </div>
    </div>
  );
}
