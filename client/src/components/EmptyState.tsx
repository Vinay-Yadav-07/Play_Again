import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-3xl border border-dashed border-navy-200 my-6">
      <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-400 mb-4">
        {icon || <PackageOpen className="w-8 h-8 text-navy-400" />}
      </div>
      <h3 className="text-lg font-bold text-navy-900 mb-1">{title}</h3>
      <p className="text-sm text-navy-500 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-xs transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
