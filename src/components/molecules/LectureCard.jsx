import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { useAuth } from "@/hooks/useAuth";

const LectureCard = ({ lecture, programSlug }) => {
  const { canAccessLevel } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const canAccess = canAccessLevel(lecture.level);
  
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

  const handlePlay = () => {
    if (canAccess) {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`card-gradient rounded-xl p-6 transition-all duration-300 ${
      canAccess ? "hover:scale-105 hover:shadow-lg hover:shadow-accent/20" : "opacity-60"
    }`}>
      <div className="flex items-start gap-4">
        <button
          onClick={handlePlay}
          disabled={!canAccess}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
            canAccess 
              ? "bg-accent hover:bg-accent/90 text-white hover:scale-110 cursor-pointer" 
              : "bg-surface text-gray-500 cursor-not-allowed"
          }`}
        >
          <ApperIcon name={isPlaying ? "Pause" : "Play"} size={20} />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${canAccess ? "text-white" : "text-gray-400"}`}>
                {lecture.title}
              </h3>
              <p className="text-sm text-gray-400 mb-2">{lecture.category}</p>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Badge variant={getLevelBadgeVariant(lecture.level)}>
                {formatLevel(lecture.level)}
              </Badge>
              
              {lecture.cohort_number && (
                <Badge variant="default">
                  Cohort {lecture.cohort_number}
                </Badge>
              )}
            </div>
          </div>
          
          {!canAccess && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ApperIcon name="Lock" size={14} />
              Upgrade to access this content
            </div>
          )}
        </div>
      </div>
      
      {isPlaying && canAccess && (
        <div className="mt-4 pt-4 border-t border-surface/50">
          <div className="video-wrapper rounded-lg overflow-hidden">
            <iframe
              src={lecture.embed_url}
              title={lecture.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default LectureCard;