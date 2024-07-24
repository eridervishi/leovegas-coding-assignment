import { renderHook, act } from '@testing-library/react-hooks';
import { useInfiniteMovies } from '../useInfiniteMovies';
import { useGetMoviesQuery } from '../../services/movies';
import { useInfiniteScroll } from '../useInfiniteScroll';

// Mock the dependencies
jest.mock('../../services/movies');
jest.mock('../useInfiniteScroll');

describe('useInfiniteMovies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with correct default values', () => {
        useGetMoviesQuery.mockReturnValue({
            data: null,
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
        });
        useInfiniteScroll.mockReturnValue({
            shouldFetch: false,
            setShouldFetch: jest.fn(),
        });

        const { result } = renderHook(() => useInfiniteMovies('test'));

        expect(result.current).toEqual({
            movies: [],
            isLoading: false,
            isError: false,
            error: null,
            hasMore: false,
            isFetchingNextPage: false,
            loadMore: expect.any(Function),
        });
    });

    it('should load more movies when conditions are met', async () => {
        const mockData = {
            results: [{ id: 1, title: 'Movie 1' }],
            page: 1,
            total_pages: 2,
        };
        const mockSetIsFetching = jest.fn();
        useGetMoviesQuery.mockReturnValue({
            data: mockData,
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
        });
        useInfiniteScroll.mockReturnValue({
            shouldFetch: true,
            setShouldFetch: mockSetIsFetching,
        });

        const { result } = renderHook(() => useInfiniteMovies('test'));

        // Force a re-render to trigger the effect
        act(() => {
            result.current.loadMore();
        });

        expect(result.current.movies).toEqual(mockData.results);
        expect(result.current.hasMore).toBe(true);
        expect(mockSetIsFetching).toHaveBeenCalledWith(false);
    });

    it('should reset page when search term changes', async () => {
        useGetMoviesQuery.mockReturnValue({
            data: null,
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
        });
        useInfiniteScroll.mockReturnValue({
            shouldFetch: false,
            setShouldFetch: jest.fn(),
        });

        const { result, rerender } = renderHook(
            ({ searchTerm }) => useInfiniteMovies(searchTerm),
            { initialProps: { searchTerm: 'initial' } }
        );

        rerender({ searchTerm: 'new' });

        expect(useGetMoviesQuery).toHaveBeenCalledWith({ searchTerm: 'new', page: 1 });
    });

    // Add more tests as needed
});