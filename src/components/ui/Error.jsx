import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null,
  className = "" 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="card-gradient rounded-xl p-8 max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" size={32} className="text-red-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-400 mb-6">{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;