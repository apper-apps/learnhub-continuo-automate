import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { postService } from "@/services/api/postService";

const PostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [postData, allPosts] = await Promise.all([
        postService.getBySlug(slug),
        postService.getAll()
      ]);

      setPost(postData);
      
      // Get related posts (exclude current post)
      const related = allPosts
        .filter(p => p.slug !== slug)
        .slice(0, 3);
      setRelatedPosts(related);
    } catch (err) {
      setError(err.message || "Failed to load article");
      console.error("Error loading post details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-surface/60 rounded w-3/4"></div>
            <div className="h-64 bg-surface/40 rounded-xl"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-surface/40 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
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

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Empty
          title="Article not found"
          description="The article you're looking for doesn't exist or has been removed."
          icon="Search"
          action={
            <Link to="/insight">
              <Button variant="secondary" icon="ArrowLeft">
                Back to Insights
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const readTime = Math.ceil(post.content_richtext.length / 1000);

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/insight"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors duration-200"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Insights
          </Link>
        </div>

        {/* Article Header */}
        <article className="mb-16">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <ApperIcon name="Calendar" size={18} />
                <span>{format(new Date(post.created_at), "MMMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" size={18} />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="User" size={18} />
                <span>Author</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden mb-8">
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content_richtext }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-surface/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Share this article:</span>
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 bg-surface hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200">
                    <ApperIcon name="Twitter" size={18} />
                  </button>
                  <button className="w-10 h-10 bg-surface hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200">
                    <ApperIcon name="Linkedin" size={18} />
                  </button>
                  <button className="w-10 h-10 bg-surface hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200">
                    <ApperIcon name="Link" size={18} />
                  </button>
                </div>
              </div>
              
              <button className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors duration-200">
                <ApperIcon name="Bookmark" size={18} />
                Save Article
              </button>
            </div>
          </footer>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.Id}
                  to={`/insight/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="card-gradient rounded-xl overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <img
                      src={relatedPost.thumbnail_url}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-200">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                        <ApperIcon name="Calendar" size={12} />
                        {format(new Date(relatedPost.created_at), "MMM dd")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="mt-20">
          <div className="card-gradient rounded-2xl p-8 text-center">
            <ApperIcon name="Mail" size={48} className="text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Want more insights like this?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest articles, tutorials, and industry insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-surface border border-surface/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetailPage;