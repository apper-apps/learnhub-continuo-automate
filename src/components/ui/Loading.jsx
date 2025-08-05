import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-surface/60 rounded-lg w-3/4"></div>
        <div className="h-4 bg-surface/40 rounded w-1/2"></div>
      </div>
      
      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card-gradient rounded-xl p-6 space-y-4">
            <div className="h-48 bg-surface/40 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-6 bg-surface/60 rounded w-3/4"></div>
              <div className="h-4 bg-surface/40 rounded w-full"></div>
              <div className="h-4 bg-surface/40 rounded w-2/3"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-surface/40 rounded w-1/4"></div>
              <div className="h-8 bg-accent/30 rounded-lg w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;