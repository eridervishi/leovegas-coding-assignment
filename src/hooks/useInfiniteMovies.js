import { useState, useEffect, useCallback, useRef } from 'react';
import { useGetMoviesQuery } from '../services/movies';
import { useInfiniteScroll } from './useInfiniteScroll';

export const useInfiniteMovies = (searchTerm, options = {}) => {
  const [page, setPage] = useState(1);
  const loadingRef = useRef(false);
  const { data, isLoading, isFetching, isError, error } = useGetMoviesQuery({ searchTerm, page });
  const { isFetching: isScrollFetching, setIsFetching: setIsScrollFetching } = useInfiniteScroll(options);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && !isFetching && !isLoading && data?.page < data?.total_pages) {
      loadingRef.current = true;
      setPage(prevPage => prevPage + 1);
    }
  }, [isFetching, isLoading, data]);

  useEffect(() => {
    if (isScrollFetching && !isFetching && !isLoading) {
      loadMore();
    }
  }, [isScrollFetching, isFetching, isLoading, loadMore]);

  useEffect(() => {
    setIsScrollFetching(false);
    loadingRef.current = false;
  }, [data, setIsScrollFetching]);

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
    loadingRef.current = false;
  }, [searchTerm]);

  return {
    movies: data?.results || [],
    isLoading,
    isError,
    error,
    hasMore: data?.page < data?.total_pages,
    isFetchingNextPage: isFetching && page > 1,
    loadMore
  };
};