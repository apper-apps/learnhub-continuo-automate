import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { postService } from "@/services/api/postService";
import { useAuth } from "@/hooks/useAuth";

const AdminPostsPage = () => {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadPosts = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await postService.getAll();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError(err.message || "Failed to load posts");
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadPosts();
    }
  }, [isAdmin]);

  useEffect(() => {
    let filtered = [...posts];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await postService.delete(postId);
      setPosts(posts.filter(post => post.Id !== postId));
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error("Failed to delete post");
      console.error("Error deleting post:", err);
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
        <Error message={error} onRetry={loadPosts} />
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
            Create Post
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-gray-400">Manage blog posts and insights</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">{posts.length}</div>
            <div className="text-gray-400 text-sm">Total Posts</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {posts.filter(p => new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-gray-400 text-sm">Published This Month</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {Math.round(posts.reduce((acc, p) => acc + p.content_richtext.length, 0) / posts.length / 1000) || 0}
            </div>
            <div className="text-gray-400 text-sm">Avg. Read Time (min)</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="w-full lg:w-96">
            <SearchBar
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={clearSearch}
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div key={post.Id} className="card-gradient rounded-xl overflow-hidden">
                <div className="relative">
                  <img
                    src={post.thumbnail_url}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={12} />
                      {format(new Date(post.created_at), "MMM dd, yyyy")}
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Clock" size={12} />
                      {Math.ceil(post.content_richtext.length / 1000)} min
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      ID: {post.Id}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link to={`/insight/${post.slug}`}>
                        <Button variant="ghost" size="sm" icon="Eye">
                          View
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" icon="Edit">
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon="Trash2"
                        onClick={() => handleDeletePost(post.Id)}
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
            title="No posts found"
            description="Try adjusting your search terms to find posts."
            icon="FileText"
            action={
              <Button icon="Plus">
                Create First Post
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default AdminPostsPage;