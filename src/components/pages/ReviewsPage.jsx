import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ReviewCard from "@/components/molecules/ReviewCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { reviewService } from "@/services/api/reviewService";
import { useAuth } from "@/hooks/useAuth";

const ReviewsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const loadReviews = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await reviewService.getAll();
      setReviews(data);
    } catch (err) {
      setError(err.message || "Failed to load reviews");
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleReviewUpdate = (updatedReview) => {
    setReviews(reviews.map(review => 
      review.Id === updatedReview.Id ? updatedReview : review
    ));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.warning("Please log in to submit a review");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please enter your review");
      return;
    }

    if (reviewText.length > 500) {
      toast.error("Review must be 500 characters or less");
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview = await reviewService.create({
        text: reviewText.trim(),
        author_id: user.id
      });

      setReviews([newReview, ...reviews]);
      setReviewText("");
      setShowReviewForm(false);
      toast.success("Review submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit review");
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReview = () => {
    setReviewText("");
    setShowReviewForm(false);
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
        <Error message={error} onRetry={loadReviews} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Student Reviews
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Hear from our community of learners who have transformed their careers through our programs.
            Real stories from real students.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">{reviews.length}+</div>
            <div className="text-gray-400">Student Reviews</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">4.9</div>
            <div className="text-gray-400">Average Rating</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">95%</div>
            <div className="text-gray-400">Would Recommend</div>
          </div>
          <div className="card-gradient rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">87%</div>
            <div className="text-gray-400">Career Growth</div>
          </div>
        </div>

        {/* Add Review Button */}
        {isAuthenticated && !showReviewForm && (
          <div className="text-center mb-12">
            <Button
              onClick={() => setShowReviewForm(true)}
              icon="Plus"
              className="mb-4"
            >
              Share Your Experience
            </Button>
            <p className="text-gray-400 text-sm">
              Help others by sharing your learning journey with LearnHub
            </p>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-12">
            <div className="card-gradient rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Share Your Experience
              </h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-6">
                  <label className="block text-white font-medium mb-3">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us about your experience with LearnHub..."
                    className="w-full h-32 px-4 py-3 bg-surface border border-surface/50 rounded-lg text-white placeholder-gray-400 resize-none transition-all duration-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-400">
                      Share your honest experience to help other learners
                    </span>
                    <span className={`text-sm ${reviewText.length > 450 ? "text-accent" : "text-gray-400"}`}>
                      {reviewText.length}/500
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!reviewText.trim() || reviewText.length > 500}
                    icon="Send"
                  >
                    Submit Review
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelReview}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <ReviewCard 
                key={review.Id} 
                review={review} 
                onUpdate={handleReviewUpdate}
              />
            ))}
          </div>
        ) : (
          <Empty
            title="No reviews yet"
            description="Be the first to share your experience with LearnHub!"
            icon="MessageSquare"
            action={
              isAuthenticated ? (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  icon="Plus"
                >
                  Write First Review
                </Button>
              ) : (
                <Button icon="LogIn">
                  Log In to Review
                </Button>
              )
            }
          />
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="card-gradient rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Join Our Success Stories?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your learning journey today and become part of our thriving community of successful professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" icon="PlayCircle">
                Start Learning Today
              </Button>
              <Button variant="secondary" size="lg" icon="Users">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;