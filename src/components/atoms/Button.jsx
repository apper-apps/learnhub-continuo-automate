import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className,
  variant = "primary",
  size = "default",
  children,
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-accent/30 hover:scale-105",
    secondary: "bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white hover:scale-105",
    outline: "bg-transparent border border-surface text-white hover:bg-surface hover:scale-105",
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-surface/50 hover:scale-105"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm gap-1.5",
    default: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-3"
  };

  const iconSize = size === "sm" ? 16 : size === "lg" ? 20 : 18;

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={iconSize} className="animate-spin" />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} size={iconSize} />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} size={iconSize} />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;