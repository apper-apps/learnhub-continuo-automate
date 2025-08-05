import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { reviewService } from "@/services/api/reviewService";
import { useAuth } from "@/hooks/useAuth";

const ReviewCard = ({ review, onUpdate }) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(review.likes);
  
  const isLiked = user && currentLikes.includes(user.id);

  const handleLike = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.warning("Please log in to like reviews");
      return;
    }

    if (isLiking) return;
    
    setIsLiking(true);
    
    try {
      const updatedReview = await reviewService.toggleLike(review.Id, user.id);
      setCurrentLikes(updatedReview.likes);
      
      if (onUpdate) {
        onUpdate(updatedReview);
      }
      
      toast.success(isLiked ? "Like removed" : "Review liked!");
    } catch (error) {
      toast.error("Failed to update like");
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="card-gradient rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/20">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-accent to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
          <ApperIcon name="User" size={20} className="text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-white">Student Review</p>
              <p className="text-xs text-gray-400">
                {format(new Date(review.created_at), "MMM dd, yyyy")}
              </p>
            </div>
            
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isLiked
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "bg-surface/50 text-gray-400 border border-surface/50 hover:bg-accent/10 hover:text-accent hover:border-accent/30"
              } ${isLiking ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
            >
              <ApperIcon 
                name={isLiked ? "Heart" : "Heart"} 
                size={14} 
                className={isLiked ? "fill-current" : ""} 
              />
              <span>{currentLikes.length}</span>
            </button>
          </div>
          
          <blockquote className="text-gray-300 leading-relaxed">
            "{review.text}"
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;