import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReviewCard = ({ review, onUpvote }) => {
  const navigate = useNavigate();

  const handleUpvoteClick = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking upvote
    onUpvote(review.id);
  };

  // Format the created_at timestamp
  const formattedTime = new Date(review.created_at).toLocaleString();

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
      <div 
        onClick={() => navigate(`/post/${review.id}`)}
        className="cursor-pointer"
      >
        <img
          src={review.movie_picture || '/api/placeholder/300/200'}
          alt={review.movie_name}
          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{review.movie_name}</h3>
          <div className="flex items-center">
            <span className="mr-1 font-semibold">
              {parseFloat(review.rating).toFixed(1)}
            </span>
            <Star className="text-yellow-500" fill="currentColor" size={20} />
          </div>
        </div>
        <p className="text-gray-700 mb-2 line-clamp-3">{review.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">By {review.name}</span>
          <span className="text-gray-500 text-sm">{formattedTime}</span> {/* Display time */}
          <button
            onClick={handleUpvoteClick}
            className="flex items-center text-red-500 hover:text-red-600"
          >
            <Heart className={`mr-1 ${review.upvotes > 0 ? 'fill-current' : ''}`} />
            {review.upvotes || 0}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;