import { useState, useEffect, useCallback } from "react";
import axios from "../../api/axios";
import useAxiosPrivate from "../useAxiosPrivate";

const useReviews = (productId) => {
  const axiosPrivate = useAxiosPrivate();

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

  const fetchReviews = useCallback(
    async (page = 1, sortBy = sort) => {
      if (!productId) return;
      setIsLoading(true);
      try {
        const res = await axios.get(`/products/${productId}/reviews`, {
          params: { page, limit: 10, sort: sortBy },
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
    [productId, sort],
  );

  useEffect(() => {
    fetchReviews(1, sort);
  }, [productId, sort]);

  const changePage = (page) => {
    fetchReviews(page, sort);
  };

  const changeSort = (newSort) => {
    setSort(newSort);
  };

  const submitReview = async (data) => {
    const res = await axiosPrivate.post(`/products/${productId}/reviews`, data);
    // Refresh list to show new review + updated stats
    await fetchReviews(1, sort);
    return res.data;
  };

  const updateReview = async (reviewId, data) => {
    const res = await axiosPrivate.put(`/reviews/${reviewId}`, data);
    await fetchReviews(pagination.page, sort);
    return res.data;
  };

  const deleteReview = async (reviewId) => {
    await axiosPrivate.delete(`/reviews/${reviewId}`);
    await fetchReviews(pagination.page, sort);
  };

  const markHelpful = async (reviewId) => {
    const res = await axiosPrivate.post(`/reviews/${reviewId}/helpful`);
    // Update in-place to avoid full refetch
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
    refetch: () => fetchReviews(pagination.page, sort),
  };
};

export default useReviews;
