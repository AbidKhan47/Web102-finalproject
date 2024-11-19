import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';
import { supabase } from '../lib/supabaseclient';

const HomePage = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ratings')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleUpvote = async (id) => {
    try {
      // First get the current review
      const { data: currentReview } = await supabase
        .from('ratings')
        .select('upvotes')
        .eq('id', id)
        .single();

      // Update the upvotes
      const { error } = await supabase
        .from('ratings')
        .update({ upvotes: (currentReview?.upvotes || 0) + 1 })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setReviews(reviews.map(review =>
        review.id === id
          ? { ...review, upvotes: (review.upvotes || 0) + 1 }
          : review
      ));
    } catch (err) {
      console.error('Error upvoting:', err);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.movie_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center">
        <Search className="mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews.map(review => (
          <ReviewCard 
            key={review.id} 
            review={review} 
            onUpvote={handleUpvote}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;