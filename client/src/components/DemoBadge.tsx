import React from 'react';
import { Sparkles } from 'lucide-react';

interface DemoBadgeProps {
  label?: string;
  className?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  label = 'Demo Listing',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300/80 shadow-xs ${className}`}
      title="Sample listing created for demonstration and academic assessment"
    >
      <Sparkles className="w-3 h-3 text-amber-600" />
      {label}
    </span>
  );
};
