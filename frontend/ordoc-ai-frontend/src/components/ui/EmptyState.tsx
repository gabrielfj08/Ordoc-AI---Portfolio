import React from 'react';

interface EmptyStateProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionButton,
}: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <Icon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
      <h2 className="mt-2 text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-gray-500">{description}</p>}
      {actionButton && (
        <div className="mt-6">
          <button
            type="button"
            onClick={actionButton.onClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
          >
            {actionButton.text}
          </button>
        </div>
      )}
    </div>
  );
}

