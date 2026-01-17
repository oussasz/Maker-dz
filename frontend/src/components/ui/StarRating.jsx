import React, { useState } from "react";
import { Star } from "lucide-react";
import axios from "../../api/axios";

const StarRating = ({ 
  rating, 
  maxRating = 5, 
  onRate, 
  productId, 
  userId, 
  disabled = true 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (newRating) => {
    if (disabled || isSubmitting) return;
    
    setIsSubmitting(true); // Indicate submission in progress
    try {
      const response = await axios.post(`/${productId}/rates`, {
        rating: newRating,
        productId: productId,
        userId: userId,
      });
      console.log('Rating submitted successfully:', response.data);
      onRate(newRating); 
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex gap-0.5">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          
          return (
            <button
              key={starValue}
              onClick={() => handleRate(starValue)}
              disabled={disabled || isSubmitting}
              aria-label={`Rate ${starValue} out of ${maxRating} stars`}
              className={`transition-opacity duration-200 ${
                disabled || isSubmitting ? 'opacity-50' : 'cursor-pointer hover:scale-110'
              }`}
            >
              <Star
                className={`transition-colors h-3.5 w-3.5 lg:h-4.5 lg:w-4.5 text-sm duration-200 ${
                  isFilled 
                    ? "text-warning fill-warning" 
                    : "text-gray-400 fill-none"
                }`}
              />
            </button>
          );
        })}
      </div>
      
    </div>
  );
}

export default StarRating;