import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Star, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabaseclient";

const SinglePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("ratings")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Review not found");

        setReview(data);
        setComments(data.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const handleUpvote = async () => {
    try {
      const { data: currentReview } = await supabase
        .from("ratings")
        .select("upvotes")
        .eq("id", id)
        .single();

      const { error } = await supabase
        .from("ratings")
        .update({ upvotes: (currentReview?.upvotes || 0) + 1 })
        .eq("id", id);

      if (error) throw error;

      setReview((prev) => ({
        ...prev,
        upvotes: (prev.upvotes || 0) + 1,
      }));
    } catch (err) {
      console.error("Error upvoting:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment) return;

    const newCommentData = {
      name: "Anonymous", // Can be replaced with a form input for name
      comment: newComment,
      created_at: new Date().toISOString(),
    };

    const updatedComments = [...comments, newCommentData];

    try {
      setLoading(true);
      const { error } = await supabase
        .from("ratings")
        .update({ comments: updatedComments })
        .eq("id", id);

      if (error) throw error;

      setComments(updatedComments);
      setNewComment("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => setEditing((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from("ratings")
        .update({
          movie_name: review.movie_name,
          description: review.description,
          rating: review.rating,
        })
        .eq("id", id);

      if (error) throw error;

      alert("Review updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("ratings").delete().eq("id", id);

      if (error) throw error;

      alert("Review deleted successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4">Error: {error}</div>;
  if (!review) return <div className="container mx-auto p-4">Review not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="mr-2" />
        Back to Reviews
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {!editing ? (
          <>
            <img
              src={review.movie_picture || "/api/placeholder/800/400"}
              alt={review.movie_name}
              className="w-full h-96 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{review.movie_name}</h1>
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-semibold mr-2">
                    {parseFloat(review.rating).toFixed(1)}
                  </span>
                  <Star className="text-yellow-500" fill="currentColor" size={24} />
                </div>
              </div>

              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {review.description}
              </p>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Reviewed by</span>
                  <span className="font-semibold">{review.name}</span>
                </div>
                <button
                  onClick={handleUpvote}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-600"
                >
                  <Heart className={review.upvotes > 0 ? "fill-current" : ""} />
                  <span>{review.upvotes || 0}</span>
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-bold">Comments</h3>
                <form onSubmit={handleAddComment} className="mt-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 border rounded"
                    placeholder="Add a comment..."
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                  >
                    Add Comment
                  </button>
                </form>

                <div className="mt-6">
                  {comments.map((comment, index) => (
                    <div key={index} className="border-t pt-4">
                      <p className="font-semibold">{comment.name}</p>
                      <p>{comment.comment}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex space-x-4">
                <button
                  onClick={handleEditToggle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit Review
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete Review
                </button>
              </div>
            </div>
          </>
        ) : (
          <form className="p-6" onSubmit={handleUpdate}>
            <div className="mb-4">
              <label htmlFor="movie_name" className="block text-gray-700 font-bold">
                Movie Name
              </label>
              <input
                type="text"
                id="movie_name"
                name="movie_name"
                value={review.movie_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-bold">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={review.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-gray-700 font-bold">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                id="rating"
                name="rating"
                value={review.rating}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SinglePostPage;
