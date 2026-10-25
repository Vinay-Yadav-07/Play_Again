import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading equipment...',
  className = 'py-20',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-xs animate-spin">
        <RefreshCw className="w-6 h-6" />
      </div>
      <p className="text-sm font-semibold text-navy-600 animate-pulse">{message}</p>
    </div>
  );
};
