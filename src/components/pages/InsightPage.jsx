import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import PostCard from "@/components/molecules/PostCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { postService } from "@/services/api/postService";

const InsightPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Posts", icon: "Grid3X3" },
    { value: "web-development", label: "Web Development", icon: "Code" },
    { value: "data-science", label: "Data Science", icon: "BarChart3" },
    { value: "mobile", label: "Mobile Development", icon: "Smartphone" },
    { value: "ai", label: "AI & Machine Learning", icon: "Bot" },
    { value: "career", label: "Career Tips", icon: "TrendingUp" },
  ];

  const loadPosts = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await postService.getAll();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError(err.message || "Failed to load insights");
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    let filtered = [...posts];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter (mock implementation based on keywords)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => {
        const content = (post.title + " " + post.excerpt + " " + post.content_richtext).toLowerCase();
        
        switch (selectedCategory) {
          case "web-development":
            return content.includes("web") || content.includes("react") || content.includes("javascript");
          case "data-science":
            return content.includes("data") || content.includes("analytics") || content.includes("python");
          case "mobile":
            return content.includes("mobile") || content.includes("app") || content.includes("ios") || content.includes("android");
          case "ai":
            return content.includes("ai") || content.includes("machine learning") || content.includes("artificial");
          case "career":
            return content.includes("career") || content.includes("job") || content.includes("skill");
          default:
            return true;
        }
      });
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory]);

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
        <Error message={error} onRetry={loadPosts} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Learning Insights
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay ahead of the curve with expert insights, industry trends, and practical tips 
            from our community of technology professionals and educators.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="w-full lg:w-96">
              <SearchBar
                placeholder="Search insights..."
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={clearSearch}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.value
                      ? "bg-accent text-white shadow-lg shadow-accent/30"
                      : "bg-surface text-gray-300 hover:bg-surface/80 hover:text-white"
                  }`}
                >
                  <ApperIcon name={category.icon} size={16} />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && !searchQuery && selectedCategory === "all" && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <ApperIcon name="Star" size={24} className="text-accent" />
              Featured Article
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center card-gradient rounded-2xl overflow-hidden">
              <div className="relative h-80 lg:h-full">
                <img
                  src={filteredPosts[0].thumbnail_url}
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {filteredPosts[0].title}
                </h3>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Calendar" size={16} />
                    {new Date(filteredPosts[0].created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Clock" size={16} />
                    {Math.ceil(filteredPosts[0].content_richtext.length / 1000)} min read
                  </div>
                </div>
                <button className="btn-primary">
                  Read Full Article
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(searchQuery || selectedCategory !== "all" ? 0 : 1).map((post) => (
              <PostCard key={post.Id} post={post} />
            ))}
          </div>
        ) : (
          <Empty
            title="No articles found"
            description="Try adjusting your search terms or category filters to find relevant insights."
            icon="Search"
          />
        )}

        {/* Newsletter CTA */}
        <div className="mt-20 pt-12 border-t border-surface/20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="card-gradient rounded-2xl p-8">
              <ApperIcon name="Mail" size={48} className="text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-400 mb-6">
                Get the latest insights and learning resources delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-surface border border-surface/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                />
                <button className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightPage;