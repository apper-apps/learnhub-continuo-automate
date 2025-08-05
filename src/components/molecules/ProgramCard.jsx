import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ProgramCard = ({ program }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/program/${program.slug}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="card-gradient rounded-xl overflow-hidden cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20"
    >
      <div className="relative overflow-hidden">
        <img
          src={program.thumbnail_url}
          alt={program.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {program.has_common_course && (
          <div className="absolute top-4 right-4">
            <Badge variant="accent">
              <ApperIcon name="Star" size={12} />
              <span className="ml-1">Common Course</span>
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-accent transition-colors duration-200">
          {program.title}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {program.description_short}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-accent text-sm font-medium">
            <ApperIcon name="PlayCircle" size={16} className="mr-2" />
            Start Learning
          </div>
          
          <ApperIcon 
            name="ArrowRight" 
            size={16} 
            className="text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" 
          />
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;