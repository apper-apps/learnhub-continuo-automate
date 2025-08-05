import { useState, useEffect } from "react";

// Mock user data - in real app this would come from authentication service
const mockUser = {
  id: "user_1",
  name: "Alex Chen",
  email: "alex@example.com",
  role: "master", // free, member, master, both
  master_cohort: 3,
  is_admin: true,
  avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
};

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const hasRole = (requiredRole) => {
    if (!user) return false;
    if (user.role === "both") return true;
    return user.role === requiredRole;
  };

  const canAccessLevel = (level) => {
    if (!user) return level === "free";
    
    switch (level) {
      case "membership":
        return hasRole("member") || hasRole("master");
      case "master":
        return hasRole("master");
      case "master_common":
        return hasRole("master");
      default:
        return true;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasRole,
    canAccessLevel,
    isAdmin: user?.is_admin || false
  };
}