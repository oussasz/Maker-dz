import React, { useState } from "react";
import { Star, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const ReviewForm = ({ onSubmit, editingReview, onCancelEdit }) => {
  const [rating, setRating] = useState(editingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(editingReview?.title || "");
  const [comment, setComment] = useState(editingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!editingReview;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
      });

      // Reset form if creating (not editing)
      if (!isEditing) {
        setRating(0);
        setTitle("");
        setComment("");
      }
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(msg || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          {isEditing ? "Edit your review" : "Write a review"}
        </h3>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Star selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-500 self-center">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label
          htmlFor="reviewTitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="reviewTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
          placeholder="Summarize your experience"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label
          htmlFor="reviewComment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Review <span className="text-gray-400">(optional)</span>
        </label>
        <Textarea
          id="reviewComment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="Share more details about your experience..."
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        {isEditing ? "Update Review" : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;
