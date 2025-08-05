import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className,
  variant = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface text-gray-300 border-surface/50",
    accent: "bg-accent/20 text-accent border-accent/30",
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    danger: "bg-red-500/20 text-red-400 border-red-500/30",
    membership: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    master: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    master_common: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;