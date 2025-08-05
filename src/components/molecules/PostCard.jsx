import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/insight/${post.slug}`);
  };

  const readTime = Math.ceil(post.content_richtext.length / 1000);

  return (
    <article 
      onClick={handleClick}
      className="card-gradient rounded-xl overflow-hidden cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20"
    >
      <div className="relative overflow-hidden">
        <img
          src={post.thumbnail_url}
          alt={post.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <ApperIcon name="Calendar" size={12} />
            {format(new Date(post.created_at), "MMM dd, yyyy")}
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Clock" size={12} />
            {readTime} min read
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-200">
          {post.title}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-accent text-sm font-medium">
            <ApperIcon name="BookOpen" size={16} className="mr-2" />
            Read More
          </div>
          
          <ApperIcon 
            name="ArrowRight" 
            size={16} 
            className="text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" 
          />
        </div>
      </div>
    </article>
  );
};

export default PostCard;