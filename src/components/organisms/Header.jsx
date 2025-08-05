import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Insight", href: "/insight" },
    { name: "Reviews", href: "/reviews" },
  ];

  const programLinks = [
    { name: "All Programs", href: "/program" },
    { name: "Membership", href: "/program/membership" },
    { name: "Master", href: "/program/master" },
  ];

  const isActiveLink = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-pink-400 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
              <ApperIcon name="GraduationCap" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-200">
              LearnHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActiveLink(item.href)
                    ? "text-accent"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Program Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProgramDropdownOpen(!isProgramDropdownOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                  isActiveLink("/program")
                    ? "text-accent"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Program
                <ApperIcon 
                  name="ChevronDown" 
                  size={16} 
                  className={`transform transition-transform duration-200 ${isProgramDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProgramDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 glass-effect rounded-lg shadow-xl border border-surface/20 py-2">
                  {programLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsProgramDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-surface/50 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Conditional Navigation Items */}
            {isAuthenticated && (
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActiveLink("/profile")
                    ? "text-accent"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Profile
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActiveLink("/admin")
                    ? "text-accent"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* User Profile or CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-gray-300">{user.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button className="btn-secondary text-sm px-4 py-2">
                  Sign In
                </button>
                <button className="btn-primary text-sm px-4 py-2">
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-surface/50 transition-colors duration-200"
          >
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              size={24} 
              className="text-gray-300" 
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-surface/20">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                className={`block text-base font-medium transition-colors duration-200 ${
                  isActiveLink(item.href)
                    ? "text-accent"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="space-y-2">
              <div className="text-base font-medium text-gray-300">Program</div>
              {programLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className="block pl-4 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className={`block text-base font-medium transition-colors duration-200 ${
                  isActiveLink("/profile")
                    ? "text-accent"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Profile
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className={`block text-base font-medium transition-colors duration-200 ${
                  isActiveLink("/admin")
                    ? "text-accent"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Admin
              </Link>
            )}

            {!isAuthenticated && (
              <div className="pt-4 space-y-3 border-t border-surface/20">
                <button className="w-full btn-secondary text-sm">
                  Sign In
                </button>
                <button className="w-full btn-primary text-sm">
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;