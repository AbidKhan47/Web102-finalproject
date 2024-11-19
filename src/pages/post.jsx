import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const PostPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({
    movie_name: '',
    name: '',
    rating: '5.0', // Default value set to middle of range
    description: '',
    movie_picture: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('ratings')
        .insert([
          {
            ...newReview,
            rating: parseFloat(newReview.rating),
            upvotes: 0
          }
        ]);
      
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Post a Review</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Movie Name</label>
            <input
              type="text"
              name="movie_name"
              value={newReview.movie_name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              name="name"
              value={newReview.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Rating: {parseFloat(newReview.rating).toFixed(1)}
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">0</span>
              <input
                type="range"
                name="rating"
                min="0"
                max="10"
                step="0.1"
                value={newReview.rating}
                onChange={handleInputChange}
                required
                className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500">10</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Your Review</label>
            <textarea
              name="description"
              value={newReview.description}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Movie Picture URL</label>
            <input
              type="url"
              name="movie_picture"
              value={newReview.movie_picture}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Posting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostPage;