import React, { useState } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import useAuth from "../../store/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog.tsx";

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "helpful", label: "Most Helpful" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
];

const ReviewList = ({
  reviews,
  stats,
  pagination,
  sort,
  isLoading,
  onPageChange,
  onSortChange,
  onSubmit,
  onUpdate,
  onDelete,
  onHelpful,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [editingReview, setEditingReview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user already has a review
  const userReview = isAuthenticated
    ? reviews.find((r) => r.user_id === user?.id)
    : null;

  const handleEdit = (review) => {
    setEditingReview(review);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleSubmit = async (data) => {
    if (editingReview) {
      await onUpdate(editingReview.id, data);
      setEditingReview(null);
    } else {
      await onSubmit(data);
    }
  };

  const handleDelete = (reviewId) => {
    setDeleteTarget(reviewId);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTarget);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Stats bar component
  const StatBar = ({ star, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-3 text-right text-gray-600">{star}</span>
        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-8 text-right text-gray-500 text-xs">{count}</span>
      </div>
    );
  };

  return (
    <>
      <div>
        {/* Header with stats */}
        <div className="flex flex-col lg:flex-row gap-8 mb-6">
          {/* Left: Average + stars */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {stats.average || 0}
              </div>
              <div className="flex gap-0.5 mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.round(stats.average)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {stats.total} review{stats.total !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Right: Distribution bars */}
          <div className="flex-1 max-w-xs space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => (
              <StatBar
                key={star}
                star={star}
                count={stats.distribution[star] || 0}
                total={stats.total}
              />
            ))}
          </div>
        </div>

        {/* Review form — show for authenticated users who haven't reviewed yet, or editing */}
        {isAuthenticated && (!userReview || editingReview) && (
          <div className="mb-6">
            <ReviewForm
              onSubmit={handleSubmit}
              editingReview={editingReview}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        )}

        {/* Sort + count bar */}
        {stats.total > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing {reviews.length} of {pagination.total} reviews
            </p>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Review list */}
        {isLoading ? (
          <div className="py-12 text-center text-gray-400">
            Loading reviews...
          </div>
        ) : reviews.length > 0 ? (
          <div>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={user?.id}
                currentUserRole={user?.role}
                onHelpful={onHelpful}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reviews yet</p>
            {isAuthenticated && (
              <p className="text-sm text-gray-400 mt-1">
                Be the first to share your experience!
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600 px-3">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Delete Review</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3 mt-2">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewList;
