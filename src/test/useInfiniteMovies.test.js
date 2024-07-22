import { renderHook, act } from '@testing-library/react-hooks';
import { useInfiniteMovies } from '../hooks/useInfiniteMovies';
import { useGetMoviesQuery } from '../services/movies';

// Mock the useGetMoviesQuery hook
jest.mock('../services/movies', () => ({
    useGetMoviesQuery: jest.fn()
}));

describe('useInfiniteMovies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return initial state', () => {
        useGetMoviesQuery.mockReturnValue({
            data: { results: [], page: 1, total_pages: 10 },
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null
        });

        const { result } = renderHook(() => useInfiniteMovies('test'));

        expect(result.current.movies).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.hasMore).toBe(true);
        expect(result.current.isFetchingNextPage).toBe(false);
    });

    it('should load more movies when scrolling', async () => {
        const mockMovies = [{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }];
        useGetMoviesQuery.mockReturnValueOnce({
            data: { results: mockMovies, page: 1, total_pages: 2 },
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null
        }).mockReturnValueOnce({
            data: { results: [...mockMovies, { id: 3, title: 'Movie 3' }], page: 2, total_pages: 2 },
            isLoading: false,
            isFetching: true,
            isError: false,
            error: null
        });

        const { result, waitForNextUpdate } = renderHook(() => useInfiniteMovies('test'));

        expect(result.current.movies).toEqual(mockMovies);

        // Simulate scrolling
        act(() => {
            result.current.loadMore();
        });

        await waitForNextUpdate();

        expect(result.current.movies).toHaveLength(3);
        expect(result.current.hasMore).toBe(false);
    });

    it('should handle errors', () => {
        useGetMoviesQuery.mockReturnValue({
            data: null,
            isLoading: false,
            isFetching: false,
            isError: true,
            error: { message: 'An error occurred' }
        });

        const { result } = renderHook(() => useInfiniteMovies('test'));

        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual({ message: 'An error occurred' });
    });
});