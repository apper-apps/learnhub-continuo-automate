import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProgramCard from "@/components/molecules/ProgramCard";
import PostCard from "@/components/molecules/PostCard";
import ReviewCard from "@/components/molecules/ReviewCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { programService } from "@/services/api/programService";
import { postService } from "@/services/api/postService";
import { reviewService } from "@/services/api/reviewService";

const HomePage = () => {
  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [programs, posts, reviews] = await Promise.all([
        programService.getAll(),
        postService.getFeatured(3),
        reviewService.getFeatured(3)
      ]);

      setFeaturedPrograms(programs.slice(0, 3));
      setFeaturedPosts(posts);
      setFeaturedReviews(reviews);
    } catch (err) {
      setError(err.message || "Failed to load content");
      console.error("Error loading homepage data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Loading className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" />
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
    <div className="min-h-screen">
      {/* Hero Section */}
<div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-background"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ff6b8b\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-8">
              <ApperIcon name="Sparkles" size={16} className="text-accent" />
              <span className="text-accent text-sm font-medium">Transform Your Career</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Master the Future of
              <span className="text-gradient block mt-2">Technology</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of learners mastering cutting-edge skills through our premium educational platform. 
              From web development to AI, we'll guide you every step of the way.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" icon="PlayCircle" className="text-lg px-8 py-4">
                Start Learning Today
              </Button>
              <Button variant="secondary" size="lg" icon="BookOpen" className="text-lg px-8 py-4">
                Explore Programs
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <ApperIcon name="Users" size={16} className="text-accent" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Award" size={16} className="text-accent" />
                <span>Industry Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" size={16} className="text-accent" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Programs
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover our most popular courses designed by industry experts to accelerate your career growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredPrograms.map((program) => (
              <ProgramCard key={program.Id} program={program} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/program">
              <Button variant="secondary" icon="ArrowRight" iconPosition="right">
                View All Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Insights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Latest Insights
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and insights from our community of experts and learners.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredPosts.map((post) => (
              <PostCard key={post.Id} post={post} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/insight">
              <Button variant="secondary" icon="ArrowRight" iconPosition="right">
                Read More Insights
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Hear from our students who transformed their careers through our programs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredReviews.map((review) => (
              <ReviewCard key={review.Id} review={review} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/reviews">
              <Button variant="secondary" icon="ArrowRight" iconPosition="right">
                Read All Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card-gradient rounded-2xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful learners who have advanced their careers with our comprehensive programs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" icon="Rocket" className="text-lg px-8 py-4">
                Start Your Journey
              </Button>
              <Button variant="ghost" size="lg" icon="MessageSquare" className="text-lg px-8 py-4">
                Talk to an Advisor
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;