import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found",
  description = "There are no items to display at the moment.",
  action = null,
  icon = "Search",
  className = "" 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} size={40} className="text-accent/60" />
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold text-white mb-3">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-8 text-lg">
          {description}
        </p>
        
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default Empty;