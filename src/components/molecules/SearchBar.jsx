import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = forwardRef(({ 
  className,
  placeholder = "Search...",
  onClear,
  value = "",
  ...props 
}, ref) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={18} className="text-gray-400" />
      </div>
      
      <input
        ref={ref}
        type="text"
        value={value}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3 bg-surface border border-surface/50 rounded-lg text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        {...props}
      />
      
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ApperIcon name="X" size={18} />
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;