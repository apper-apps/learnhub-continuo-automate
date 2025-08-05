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
import { programService } from "@/services/api/programService";
import { useAuth } from "@/hooks/useAuth";

const AdminProgramsPage = () => {
  const { isAdmin } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterOptions = [
    { value: "all", label: "All Programs", icon: "Grid3X3" },
    { value: "common", label: "Common Courses", icon: "Star" },
    { value: "advanced", label: "Advanced Only", icon: "Zap" },
  ];

  const loadPrograms = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await programService.getAll();
      setPrograms(data);
      setFilteredPrograms(data);
    } catch (err) {
      setError(err.message || "Failed to load programs");
      console.error("Error loading programs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadPrograms();
    }
  }, [isAdmin]);

  useEffect(() => {
    let filtered = [...programs];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description_short.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedFilter === "common") {
      filtered = filtered.filter(program => program.has_common_course);
    } else if (selectedFilter === "advanced") {
      filtered = filtered.filter(program => !program.has_common_course);
    }

    setFilteredPrograms(filtered);
  }, [programs, searchQuery, selectedFilter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleDeleteProgram = async (programId) => {
    if (!confirm("Are you sure you want to delete this program?")) {
      return;
    }

    try {
      await programService.delete(programId);
      setPrograms(programs.filter(program => program.Id !== programId));
      toast.success("Program deleted successfully");
    } catch (err) {
      toast.error("Failed to delete program");
      console.error("Error deleting program:", err);
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
        <Error message={error} onRetry={loadPrograms} />
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
          
          <Button icon="Plus">
            Create Program
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Program Management</h1>
          <p className="text-gray-400">Create and manage learning programs</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">{programs.length}</div>
            <div className="text-gray-400 text-sm">Total Programs</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {programs.filter(p => p.has_common_course).length}
            </div>
            <div className="text-gray-400 text-sm">Common Courses</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {programs.filter(p => !p.has_common_course).length}
            </div>
            <div className="text-gray-400 text-sm">Advanced Only</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="w-full lg:w-96">
              <SearchBar
                placeholder="Search programs..."
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={clearSearch}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {filterOptions.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedFilter === filter.value
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
              {filteredPrograms.length} program{filteredPrograms.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div key={program.Id} className="card-gradient rounded-xl overflow-hidden">
                <div className="relative">
                  <img
                    src={program.thumbnail_url}
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {program.has_common_course && (
                      <Badge variant="accent">
                        <ApperIcon name="Star" size={12} />
                        <span className="ml-1">Common</span>
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {program.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {program.description_short}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      ID: {program.Id}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" icon="Edit">
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon="Trash2"
                        onClick={() => handleDeleteProgram(program.Id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            title="No programs found"
            description="Try adjusting your search terms or filters to find programs."
            icon="BookOpen"
            action={
              <Button icon="Plus">
                Create First Program
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default AdminProgramsPage;