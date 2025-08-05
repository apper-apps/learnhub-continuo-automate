import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { useAuth } from "@/hooks/useAuth";

const AdminPage = () => {
  const { user, isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Shield" size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions",
      icon: "Users",
      href: "/admin/users",
      color: "blue",
      stats: "1,245 users"
    },
    {
      title: "Program Management",
      description: "Create and manage learning programs",
      icon: "BookOpen",
      href: "/admin/programs",
      color: "emerald",
      stats: "6 programs"
    },
    {
      title: "Lecture Management",
      description: "Organize lectures and course content",
      icon: "PlayCircle",
      href: "/admin/lectures",
      color: "purple",
      stats: "124 lectures"
    },
    {
      title: "Content Management",
      description: "Manage blog posts and insights",
      icon: "FileText",
      href: "/admin/posts",
      color: "pink",
      stats: "28 articles"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      pink: "bg-pink-500/20 text-pink-400 border-pink-500/30"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Shield" size={24} className="text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.name}</p>
            </div>
          </div>
          
          <div className="card-gradient rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">1,245</div>
                <div className="text-gray-400 text-sm">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">6</div>
                <div className="text-gray-400 text-sm">Active Programs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">124</div>
                <div className="text-gray-400 text-sm">Total Lectures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">28</div>
                <div className="text-gray-400 text-sm">Published Articles</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              to={section.href}
              className="group"
            >
              <div className="card-gradient rounded-xl p-8 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl hover:shadow-accent/20">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getColorClasses(section.color)}`}>
                    <ApperIcon name={section.icon} size={28} />
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{section.stats}</div>
                    <div className="text-gray-400 text-sm">Total</div>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-200">
                  {section.title}
                </h2>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {section.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-accent text-sm font-medium">
                    Manage {section.title.split(' ')[0]}
                  </span>
                  
                  <ApperIcon 
                    name="ArrowRight" 
                    size={16} 
                    className="text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" 
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-gradient rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <ApperIcon name="Plus" size={20} className="text-accent" />
                <h3 className="text-lg font-semibold text-white">Create New</h3>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-surface/50 rounded-lg transition-colors duration-200">
                  <ApperIcon name="BookOpen" size={16} className="inline mr-2" />
                  New Program
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-surface/50 rounded-lg transition-colors duration-200">
                  <ApperIcon name="PlayCircle" size={16} className="inline mr-2" />
                  New Lecture
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-surface/50 rounded-lg transition-colors duration-200">
                  <ApperIcon name="FileText" size={16} className="inline mr-2" />
                  New Article
                </button>
              </div>
            </div>

            <div className="card-gradient rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <ApperIcon name="BarChart3" size={20} className="text-accent" />
                <h3 className="text-lg font-semibold text-white">Analytics</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Users</span>
                  <span className="text-white font-medium">892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Course Completion</span>
                  <span className="text-emerald-400 font-medium">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Revenue</span>
                  <span className="text-accent font-medium">$42,150</span>
                </div>
              </div>
            </div>

            <div className="card-gradient rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <ApperIcon name="Settings" size={20} className="text-accent" />
                <h3 className="text-lg font-semibold text-white">System</h3>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-surface/50 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Database" size={16} className="inline mr-2" />
                  Backup Data
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-surface/50 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Shield" size={16} className="inline mr-2" />
                  Security Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-surface/50 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Mail" size={16} className="inline mr-2" />
                  Email Templates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;