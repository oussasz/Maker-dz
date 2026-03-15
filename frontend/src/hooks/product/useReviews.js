import { useState, useEffect, useRef, useCallback } from "react";
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

  // Ref to track current fetch request ID (prevents race conditions)
  const fetchCounterRef = useRef(0);
  // Ref to always have access to the latest sort value
  const sortRef = useRef(sort);
  sortRef.current = sort;

  // Core fetch function — stable identity via useCallback with only productId dep
  const fetchReviews = useCallback(
    async (page = 1, sortOverride) => {
      if (!productId) return;

      const id = ++fetchCounterRef.current;
      const sortVal = sortOverride ?? sortRef.current;
      setIsLoading(true);

      try {
        const { data } = await axios.get(`/products/${productId}/reviews`, {
          params: { page, limit: 10, sort: sortVal, _t: Date.now() },
        });

        // Discard if a newer fetch was started
        if (id !== fetchCounterRef.current) return;

        setReviews(data.reviews ?? []);
        setStats(data.stats ?? { total: 0, average: 0, distribution: {} });
        setPagination(data.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 });
      } catch (err) {
        console.error("[useReviews] fetch error:", err?.response?.status, err?.message);
      } finally {
        if (id === fetchCounterRef.current) setIsLoading(false);
      }
    },
    [productId],
  );

  // Ref so mutation callbacks always call the latest fetchReviews
  const fetchRef = useRef(fetchReviews);
  fetchRef.current = fetchReviews;

  // Load reviews on mount and when productId or sort changes
  useEffect(() => {
    fetchReviews(1, sort);
  }, [fetchReviews, sort]);

  // ─── Mutation helpers (plain functions, no useCallback) ───

  const submitReview = async (data) => {
    const res = await axiosPrivate.post(
      `/products/${productId}/reviews`,
      data,
    );
    // Wait for server-authoritative refetch
    await fetchRef.current(1);
    return res.data;
  };

  const updateReview = async (reviewId, data) => {
    const res = await axiosPrivate.put(`/reviews/${reviewId}`, data);
    await fetchRef.current(pagination.page);
    return res.data;
  };

  const deleteReview = async (reviewId) => {
    await axiosPrivate.delete(`/reviews/${reviewId}`);
    // Wait for server-authoritative refetch
    await fetchRef.current(pagination.page);
  };

  const markHelpful = async (reviewId) => {
    const res = await axiosPrivate.post(`/reviews/${reviewId}/helpful`);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, helpful_count: res.data.helpful_count }
          : r,
      ),
    );
  };

  return {
    reviews,
    stats,
    pagination,
    sort,
    isLoading,
    changePage: (page) => fetchReviews(page),
    changeSort: (newSort) => setSort(newSort),
    submitReview,
    updateReview,
    deleteReview,
    markHelpful,
    refetch: () => fetchRef.current(pagination.page),
  };
};

export default useReviews;
