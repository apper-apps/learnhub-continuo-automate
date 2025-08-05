import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { programService } from "@/services/api/programService";
import { lectureService } from "@/services/api/lectureService";

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalPrograms: 0,
    completedLectures: 0,
    hoursWatched: 0,
    certificatesEarned: 0
  });
  const [loading, setLoading] = useState(true);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Load enrolled programs (mock data based on user role)
      const allPrograms = await programService.getAll();
      const enrolled = allPrograms.slice(0, 3); // Mock enrollment
      setEnrolledPrograms(enrolled);

      // Mock statistics
      setStats({
        totalPrograms: enrolled.length,
        completedLectures: 24,
        hoursWatched: 48,
        certificatesEarned: 2
      });

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: "lecture_completed",
          title: "React Hooks Deep Dive",
          program: "Web Development Mastery",
          timestamp: "2 hours ago",
          icon: "CheckCircle"
        },
        {
          id: 2,
          type: "program_started",
          title: "Data Science Fundamentals",
          program: "Data Science Fundamentals",
          timestamp: "1 day ago",
          icon: "PlayCircle"
        },
        {
          id: 3,
          type: "certificate_earned",
          title: "Web Development Mastery Certificate",
          program: "Web Development Mastery",
          timestamp: "3 days ago",
          icon: "Award"
        }
      ]);
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      loadProfileData();
    }
  }, [user, isLoading]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen py-16">
        <Loading className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="User" size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view your profile.</p>
          <Button icon="LogIn">Log In</Button>
        </div>
      </div>
    );
  }

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "master":
        return "master";
      case "member":
        return "membership";
      case "both":
        return "accent";
      default:
        return "default";
    }
  };

  const formatRole = (role) => {
    switch (role) {
      case "master":
        return "Master Student";
      case "member":
        return "Member";
      case "both":
        return "Premium Member";
      default:
        return "Free";
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card-gradient rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-gradient-to-br from-accent to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {formatRole(user.role)}
                </Badge>
                
                {user.master_cohort && (
                  <Badge variant="default">
                    Cohort {user.master_cohort}
                  </Badge>
                )}
                
                {user.is_admin && (
                  <Badge variant="accent">
                    <ApperIcon name="Shield" size={12} />
                    <span className="ml-1">Admin</span>
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="secondary" icon="Settings">
                Edit Profile
              </Button>
              <Button icon="Download">
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="BookOpen" size={24} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.totalPrograms}</div>
            <div className="text-gray-400 text-sm">Enrolled Programs</div>
          </div>

          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="CheckCircle" size={24} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.completedLectures}</div>
            <div className="text-gray-400 text-sm">Lectures Completed</div>
          </div>

          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Clock" size={24} className="text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.hoursWatched}</div>
            <div className="text-gray-400 text-sm">Hours Watched</div>
          </div>

          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Award" size={24} className="text-accent" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stats.certificatesEarned}</div>
            <div className="text-gray-400 text-sm">Certificates</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Programs */}
          <div className="lg:col-span-2">
            <div className="card-gradient rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">My Programs</h2>
                <Button variant="secondary" size="sm" icon="Plus">
                  Browse More
                </Button>
              </div>
              
              <div className="space-y-4">
                {enrolledPrograms.map((program) => (
                  <div key={program.Id} className="bg-surface/50 rounded-lg p-4 hover:bg-surface/70 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <img
                        src={program.thumbnail_url}
                        alt={program.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{program.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{program.description_short}</p>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-surface rounded-full h-2">
                            <div 
                              className="bg-accent rounded-full h-2 transition-all duration-300"
                              style={{ width: `${Math.random() * 80 + 20}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">{Math.floor(Math.random() * 80 + 20)}%</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" icon="ArrowRight">
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="card-gradient rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <ApperIcon name={activity.icon} size={14} className="text-accent" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium mb-1">{activity.title}</p>
                      <p className="text-gray-400 text-xs mb-1">{activity.program}</p>
                      <p className="text-gray-500 text-xs">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-surface/20">
                <Button variant="ghost" size="sm" className="w-full" icon="History">
                  View All Activity
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-gradient rounded-xl p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button variant="ghost" size="sm" className="w-full justify-start" icon="Download">
                  Download Certificates
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" icon="Settings">
                  Account Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" icon="HelpCircle">
                  Get Support
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" icon="MessageSquare">
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;