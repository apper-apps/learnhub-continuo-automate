import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import LectureCard from "@/components/molecules/LectureCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { programService } from "@/services/api/programService";
import { lectureService } from "@/services/api/lectureService";
import { useAuth } from "@/hooks/useAuth";

const ProgramDetailPage = () => {
  const { slug } = useParams();
  const { user, canAccessLevel } = useAuth();
  const [program, setProgram] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

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

      const [programData, lecturesData] = await Promise.all([
        programService.getBySlug(slug),
        lectureService.getByProgramSlug(slug)
      ]);

      setProgram(programData);
      setLectures(lecturesData);
      setFilteredLectures(lecturesData);
    } catch (err) {
      const errorMessage = err.message || "Failed to load program details";
      setError(errorMessage);
      console.error("Error loading program details:", {
        slug,
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug]);

  useEffect(() => {
    let filtered = [...lectures];

    if (selectedLevel !== "all") {
      filtered = filtered.filter(lecture => lecture.level === selectedLevel);
    }

    setFilteredLectures(filtered);
  }, [lectures, selectedLevel]);

  const getAccessibleLectures = () => {
    return filteredLectures.filter(lecture => canAccessLevel(lecture.level));
  };

  const getLockedLectures = () => {
    return filteredLectures.filter(lecture => !canAccessLevel(lecture.level));
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
        <Error message={error} onRetry={loadData} />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Empty
          title="Program not found"
          description="The program you're looking for doesn't exist or has been removed."
          icon="Search"
        />
      </div>
    );
  }

  const accessibleLectures = getAccessibleLectures();
  const lockedLectures = getLockedLectures();

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Program Header */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                {program.has_common_course && (
                  <Badge variant="accent">
                    <ApperIcon name="Star" size={12} />
                    <span className="ml-1">Common Course</span>
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {program.title}
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {program.description_long}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" icon="PlayCircle">
                  Start Learning
                </Button>
                <Button variant="secondary" size="lg" icon="BookmarkPlus">
                  Save for Later
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src={program.thumbnail_url}
                alt={program.title}
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Program Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="PlayCircle" size={24} className="text-accent" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{lectures.length}</div>
            <div className="text-gray-400 text-sm">Total Lectures</div>
          </div>

          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Users" size={24} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">2,500+</div>
            <div className="text-gray-400 text-sm">Students</div>
          </div>

          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Clock" size={24} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">40+</div>
            <div className="text-gray-400 text-sm">Hours Content</div>
          </div>

          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Award" size={24} className="text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">95%</div>
            <div className="text-gray-400 text-sm">Satisfaction</div>
          </div>
        </div>

        {/* Lecture Filters */}
        <div className="mb-8">
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

          <div className="mt-4 text-center">
            <p className="text-gray-400">
              {filteredLectures.length} lecture{filteredLectures.length !== 1 ? "s" : ""} available
              {selectedLevel !== "all" && ` for ${levelFilters.find(f => f.value === selectedLevel)?.label}`}
            </p>
          </div>
        </div>

        {/* Lectures List */}
        <div className="space-y-8">
          {/* Accessible Lectures */}
          {accessibleLectures.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ApperIcon name="Unlock" size={24} className="text-emerald-400" />
                Available Lectures
              </h2>
              <div className="space-y-4">
                {accessibleLectures.map((lecture) => (
                  <LectureCard key={lecture.Id} lecture={lecture} programSlug={slug} />
                ))}
              </div>
            </div>
          )}

          {/* Locked Lectures */}
          {lockedLectures.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ApperIcon name="Lock" size={24} className="text-gray-400" />
                Premium Content
              </h2>
              <div className="space-y-4">
                {lockedLectures.map((lecture) => (
                  <LectureCard key={lecture.Id} lecture={lecture} programSlug={slug} />
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <div className="card-gradient rounded-xl p-8">
                  <ApperIcon name="Crown" size={48} className="text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Unlock Premium Content</h3>
                  <p className="text-gray-400 mb-6">
                    Upgrade your membership to access exclusive lectures and advanced content.
                  </p>
                  <Button icon="ArrowUp">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredLectures.length === 0 && (
            <Empty
              title="No lectures found"
              description="There are no lectures available for the selected filter."
              icon="PlayCircle"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage;