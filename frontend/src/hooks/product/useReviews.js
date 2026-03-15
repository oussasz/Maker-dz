import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../../api/axios";
import useAxiosPrivate from "../useAxiosPrivate";
import useAuth from "../../store/authStore";

const useReviews = (productId) => {
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [sort, setSort] = useState("recent");
  const [isLoading, setIsLoading] = useState(false);

  // Use refs so async callbacks always have the latest values
  const sortRef = useRef(sort);
  sortRef.current = sort;
  const paginationRef = useRef(pagination);
  paginationRef.current = pagination;

  const fetchReviews = useCallback(
    async (page = 1, sortBy) => {
      if (!productId) return;
      const currentSort = sortBy || sortRef.current;
      setIsLoading(true);
      try {
        const res = await axios.get(`/products/${productId}/reviews`, {
          params: { page, limit: 10, sort: currentSort },
        });
        setReviews(res.data.reviews);
        setStats(res.data.stats);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [productId],
  );

  useEffect(() => {
    fetchReviews(1, sort);
  }, [productId, sort]);

  const changePage = (page) => {
    fetchReviews(page);
  };

  const changeSort = (newSort) => {
    setSort(newSort);
  };

  const submitReview = async (data) => {
    const res = await axiosPrivate.post(`/products/${productId}/reviews`, data);
    const newReview = res.data;

    // Optimistically add the new review to the top of the list
    setReviews((prev) => [
      {
        ...newReview,
        user: {
          id: user?.id,
          username: user?.username,
          firstName: user?.firstName || user?.first_name,
          avatar: user?.avatar,
        },
      },
      ...prev,
    ]);

    // Update stats immediately
    setStats((prev) => {
      const newTotal = prev.total + 1;
      const newAverage =
        newTotal > 0
          ? parseFloat(
              ((prev.average * prev.total + data.rating) / newTotal).toFixed(1),
            )
          : data.rating;
      return {
        ...prev,
        total: newTotal,
        average: newAverage,
        distribution: {
          ...prev.distribution,
          [data.rating]: (prev.distribution[data.rating] || 0) + 1,
        },
      };
    });

    // Background refetch for accurate server data
    fetchReviews(1);

    return newReview;
  };

  const updateReview = async (reviewId, data) => {
    const res = await axiosPrivate.put(`/reviews/${reviewId}`, data);
    await fetchReviews(paginationRef.current.page);
    return res.data;
  };

  const deleteReview = async (reviewId) => {
    // Get the review before deleting to update stats
    const deletedReview = reviews.find((r) => r.id === reviewId);
    await axiosPrivate.delete(`/reviews/${reviewId}`);

    // Optimistically remove from UI immediately
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));

    // Update stats immediately
    if (deletedReview) {
      setStats((prev) => {
        const newTotal = Math.max(0, prev.total - 1);
        const newAverage =
          newTotal > 0
            ? parseFloat(
                (
                  (prev.average * prev.total - deletedReview.rating) /
                  newTotal
                ).toFixed(1),
              )
            : 0;
        return {
          ...prev,
          total: newTotal,
          average: newAverage,
          distribution: {
            ...prev.distribution,
            [deletedReview.rating]: Math.max(
              0,
              (prev.distribution[deletedReview.rating] || 0) - 1,
            ),
          },
        };
      });
    }

    // Background refetch for accurate server data
    fetchReviews(paginationRef.current.page);
  };

  const markHelpful = async (reviewId) => {
    const res = await axiosPrivate.post(`/reviews/${reviewId}/helpful`);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpful_count: res.data.helpful_count } : r,
      ),
    );
  };

  return {
    reviews,
    stats,
    pagination,
    sort,
    isLoading,
    changePage,
    changeSort,
    submitReview,
    updateReview,
    deleteReview,
    markHelpful,
    refetch: () => fetchReviews(paginationRef.current.page),
  };
};

export default useReviews;
