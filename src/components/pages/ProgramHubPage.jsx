import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import ProgramCard from "@/components/molecules/ProgramCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { programService } from "@/services/api/programService";

const ProgramHubPage = () => {
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
    loadPrograms();
  }, []);

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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Learning Programs
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our comprehensive collection of programs designed to accelerate your career growth.
            From foundational courses to advanced specializations.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
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

          {/* Results Count */}
          <div className="mt-6 text-center">
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
              <ProgramCard key={program.Id} program={program} />
            ))}
          </div>
        ) : (
          <Empty
            title="No programs found"
            description="Try adjusting your search terms or filters to find what you're looking for."
            icon="Search"
          />
        )}

        {/* Stats Section */}
        <div className="mt-20 pt-12 border-t border-surface/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">{programs.length}+</div>
              <div className="text-gray-400">Programs Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">10,000+</div>
              <div className="text-gray-400">Students Enrolled</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">95%</div>
              <div className="text-gray-400">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramHubPage;