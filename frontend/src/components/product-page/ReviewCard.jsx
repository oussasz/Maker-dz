import React from "react";
import { Star, ThumbsUp, BadgeCheck, Trash2, Pencil } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar.tsx";

const ReviewCard = ({ review, currentUserId, currentUserRole, onHelpful, onEdit, onDelete }) => {
  const isOwner = currentUserId && review.user_id === currentUserId;
  const isAdmin = currentUserRole === "admin";

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  };

  const userName =
    review.user?.firstName || review.user?.username || "Anonymous";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={review.user?.avatar || ""} alt={userName} />
          <AvatarFallback className="text-sm">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-gray-900">
                {userName}
              </span>
              {review.is_verified_purchase === 1 && (
                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  <BadgeCheck className="h-3 w-3" />
                  Verified Purchase
                </span>
              )}
              <span className="text-xs text-gray-400">
                {timeAgo(review.created_at)}
              </span>
            </div>

            {/* Owner / admin actions */}
            {(isOwner || isAdmin) && (
              <div className="flex items-center gap-1">
                {isOwner && (
                  <button
                    onClick={() => onEdit(review)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(review.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Stars */}
          <div className="flex gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Title */}
          {review.title && (
            <p className="font-medium text-sm text-gray-800 mb-1">
              {review.title}
            </p>
          )}

          {/* Comment */}
          {review.comment && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {review.comment}
            </p>
          )}

          {/* Images */}
          {review.images?.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {review.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Review image ${idx + 1}`}
                  className="h-16 w-16 object-cover rounded-lg border border-gray-100"
                />
              ))}
            </div>
          )}

          {/* Helpful button */}
          <button
            onClick={() => onHelpful(review.id)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition px-2 py-1 rounded-md hover:bg-primary/5"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Helpful{review.helpful_count > 0 && ` (${review.helpful_count})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
