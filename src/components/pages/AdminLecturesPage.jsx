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
import { lectureService } from "@/services/api/lectureService";
import { programService } from "@/services/api/programService";
import { useAuth } from "@/hooks/useAuth";

const AdminLecturesPage = () => {
  const { isAdmin } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState("all");

  const levelFilters = [
    { value: "all", label: "All Levels", icon: "Grid3X3" },
    { value: "membership", label: "Membership", icon: "Users" },
    { value: "master", label: "Master", icon: "Crown" },
    { value: "master_common", label: "Master Common", icon: "Star" },
  ];

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [lecturesData, programsData] = await Promise.all([
        lectureService.getAll(),
        programService.getAll()
      ]);
      
      setLectures(lecturesData);
      setPrograms(programsData);
      setFilteredLectures(lecturesData);
    } catch (err) {
      setError(err.message || "Failed to load lectures");
      console.error("Error loading lectures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  useEffect(() => {
    let filtered = [...lectures];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(lecture =>
        lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter(lecture => lecture.level === selectedLevel);
    }

    // Apply program filter
    if (selectedProgram !== "all") {
      filtered = filtered.filter(lecture => lecture.program_slug === selectedProgram);
    }

    setFilteredLectures(filtered);
  }, [lectures, searchQuery, selectedLevel, selectedProgram]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    try {
      await lectureService.delete(lectureId);
      setLectures(lectures.filter(lecture => lecture.Id !== lectureId));
      toast.success("Lecture deleted successfully");
    } catch (err) {
      toast.error("Failed to delete lecture");
      console.error("Error deleting lecture:", err);
    }
  };

  const getLevelBadgeVariant = (level) => {
    switch (level) {
      case "membership":
        return "membership";
      case "master":
        return "master";
      case "master_common":
        return "master_common";
      default:
        return "default";
    }
  };

  const formatLevel = (level) => {
    switch (level) {
      case "membership":
        return "Membership";
      case "master":
        return "Master";
      case "master_common":
        return "Master Common";
      default:
        return level;
    }
  };

  const getProgramTitle = (slug) => {
    const program = programs.find(p => p.slug === slug);
    return program ? program.title : slug;
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
        <Error message={error} onRetry={loadData} />
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
            Add Lecture
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Lecture Management</h1>
          <p className="text-gray-400">Organize lectures and course content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">{lectures.length}</div>
            <div className="text-gray-400 text-sm">Total Lectures</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {lectures.filter(l => l.level === "membership").length}
            </div>
            <div className="text-gray-400 text-sm">Membership</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {lectures.filter(l => l.level === "master").length}
            </div>
            <div className="text-gray-400 text-sm">Master</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {lectures.filter(l => l.level === "master_common").length}
            </div>
            <div className="text-gray-400 text-sm">Master Common</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="w-full lg:w-96">
              <SearchBar
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={clearSearch}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {levelFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedLevel(filter.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedLevel === filter.value
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

          {/* Program Filter */}
          <div className="mt-4">
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="px-4 py-2 bg-surface border border-surface/50 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Programs</option>
              {programs.map((program) => (
                <option key={program.slug} value={program.slug}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400">
              {filteredLectures.length} lecture{filteredLectures.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Lectures Table */}
        {filteredLectures.length > 0 ? (
          <div className="card-gradient rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Lecture
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Cohort
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface/20">
                  {filteredLectures.map((lecture) => (
                    <tr key={lecture.Id} className="hover:bg-surface/30 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{lecture.title}</div>
                          <div className="text-gray-400 text-sm">{lecture.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300 text-sm">
                          {getProgramTitle(lecture.program_slug)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getLevelBadgeVariant(lecture.level)}>
                          {formatLevel(lecture.level)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {lecture.cohort_number ? `Cohort ${lecture.cohort_number}` : "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {lecture.sort_order}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button variant="ghost" size="sm" icon="Edit">
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon="Trash2"
                            onClick={() => handleDeleteLecture(lecture.Id)}
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
            title="No lectures found"
            description="Try adjusting your search terms or filters to find lectures."
            icon="PlayCircle"
            action={
              <Button icon="Plus">
                Add First Lecture
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default AdminLecturesPage;