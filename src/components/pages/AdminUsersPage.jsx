import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { userService } from "@/services/api/userService";
import { useAuth } from "@/hooks/useAuth";

const AdminUsersPage = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const roleFilters = [
    { value: "all", label: "All Users", icon: "Users" },
    { value: "free", label: "Free", icon: "User" },
    { value: "member", label: "Members", icon: "UserCheck" },
    { value: "master", label: "Masters", icon: "Crown" },
    { value: "both", label: "Premium", icon: "Star" },
  ];

  const loadUsers = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load users");
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, selectedRole]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await userService.delete(userId);
      setUsers(users.filter(user => user.Id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

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
        return "Master";
      case "member":
        return "Member";
      case "both":
        return "Premium";
      default:
        return "Free";
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <Loading className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error message={error} onRetry={loadUsers} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors duration-200"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Admin Dashboard
            </Link>
          </div>
          
          <Button icon="UserPlus">
            Add New User
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage user accounts, roles, and permissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">{users.length}</div>
            <div className="text-gray-400 text-sm">Total Users</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {users.filter(u => u.role === "master" || u.role === "both").length}
            </div>
            <div className="text-gray-400 text-sm">Master Students</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {users.filter(u => u.role === "member" || u.role === "both").length}
            </div>
            <div className="text-gray-400 text-sm">Members</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {users.filter(u => u.is_admin).length}
            </div>
            <div className="text-gray-400 text-sm">Administrators</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="w-full lg:w-96">
              <SearchBar
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={clearSearch}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {roleFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedRole(filter.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedRole === filter.value
                      ? "bg-accent text-white shadow-lg shadow-accent/30"
                      : "bg-surface text-gray-300 hover:bg-surface/80 hover:text-white"
                  }`}
                >
                  <ApperIcon name={filter.icon} size={16} />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <div className="card-gradient rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Cohort
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface/20">
                  {filteredUsers.map((user) => (
                    <tr key={user.Id} className="hover:bg-surface/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-accent to-pink-400 rounded-full flex items-center justify-center">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-sm font-medium">
                                {user.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {formatRole(user.role)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {user.master_cohort ? `Cohort ${user.master_cohort}` : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {user.is_admin && (
                            <Badge variant="accent">
                              <ApperIcon name="Shield" size={12} />
                              <span className="ml-1">Admin</span>
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                        {new Date(user.joined_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button variant="ghost" size="sm" icon="Edit">
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon="Trash2"
                            onClick={() => handleDeleteUser(user.Id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Empty
            title="No users found"
            description="Try adjusting your search terms or filters to find users."
            icon="Users"
          />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;