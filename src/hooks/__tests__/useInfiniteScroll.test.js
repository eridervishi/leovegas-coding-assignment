import { renderHook, act } from '@testing-library/react-hooks';
import { useInfiniteScroll } from '../useInfiniteScroll';
import { waitFor } from '@testing-library/react';

describe('useInfiniteScroll', () => {
    let intersectionObserverCallback;
    let observeMock;
    let disconnectMock;

    beforeEach(() => {
        observeMock = jest.fn();
        disconnectMock = jest.fn();
        window.IntersectionObserver = jest.fn((callback) => {
            intersectionObserverCallback = callback;
            return {
                observe: observeMock,
                disconnect: disconnectMock,
            };
        });

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should initialize with shouldFetch as false', () => {
        const { result } = renderHook(() => useInfiniteScroll());
        expect(result.current.shouldFetch).toBe(false);
    });

    it('should create an IntersectionObserver', () => {
        renderHook(() => useInfiniteScroll());

        expect(window.IntersectionObserver).toHaveBeenCalled();
    });

    it('should set shouldFetch to true when intersection occurs', async () => {
        const { result } = renderHook(() => useInfiniteScroll());
        act(() => {
            intersectionObserverCallback([{ isIntersecting: true }]);
        });

        // Advance timers and wait for the state to update
        await act(async () => {
            jest.runAllTimers();
            await waitFor(() => expect(result.current.shouldFetch).toBe(true), { timeout: 1000 });
        });

        expect(result.current.shouldFetch).toBe(true);
    }, 10000);

    it('should respect custom options', () => {
        const customOptions = {
            threshold: 0.5,
            rootMargin: '10px',
            root: null,
            distance: '200px',
            debounceMs: 200,
        };

        renderHook(() => useInfiniteScroll(customOptions));

        expect(window.IntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            {
                threshold: 0.5,
                rootMargin: '0px 0px 200px 0px',
                root: null,
            }
        );
    });

    it('should clean up on unmount', () => {
        const { unmount } = renderHook(() => useInfiniteScroll());

        unmount();

        expect(disconnectMock).toHaveBeenCalled();
    });

    it('should debounce intersection callback', async () => {
        const { result } = renderHook(() => useInfiniteScroll({ debounceMs: 500 }));

        act(() => {
            intersectionObserverCallback([{ isIntersecting: true }]);
        });

        // Advance time by 400ms (less than debounce time)
        act(() => {
            jest.advanceTimersByTime(400);
        });

        // shouldFetch should still be false
        expect(result.current.shouldFetch).toBe(false);

        // Advance time to just after the debounce time
        await act(async () => {
            jest.advanceTimersByTime(101); // Total time now 501ms
            await waitFor(() => expect(result.current.shouldFetch).toBe(true), { timeout: 1000 });
        });
        expect(result.current.shouldFetch).toBe(true);
    });

    it('should clear and reset timer on multiple intersections within debounce period', async () => {
        const { result } = renderHook(() => useInfiniteScroll({ debounceMs: 500 }));

        // First intersection
        act(() => {
            intersectionObserverCallback([{ isIntersecting: true }]);
        });

        // Advance time by 300ms
        act(() => {
            jest.advanceTimersByTime(300);
        });

        // Second intersection (should clear the previous timer)
        act(() => {
            intersectionObserverCallback([{ isIntersecting: true }]);
        });

        // Advance time to just before the debounce time from the second intersection
        act(() => {
            jest.advanceTimersByTime(499);
        });

        // shouldFetch should still be false
        expect(result.current.shouldFetch).toBe(false);

        // Advance time to just after the debounce time
        await act(async () => {
            jest.advanceTimersByTime(1); // Total time now 800ms from first intersection, 500ms from second
            await waitFor(() => expect(result.current.shouldFetch).toBe(true), { timeout: 1000 });
        });

        expect(result.current.shouldFetch).toBe(true);
    });

    it('should clear timeout when shouldFetch changes', async () => {
        const { result } = renderHook(() => useInfiniteScroll({ debounceMs: 500 }));

        // Simulate intersection
        act(() => {
            intersectionObserverCallback([{ isIntersecting: true }]);
        });

        // Advance time by 300ms (less than debounce time)
        act(() => {
            jest.advanceTimersByTime(300);
        });

        // shouldFetch should still be false
        expect(result.current.shouldFetch).toBe(false);

        // Simulate shouldFetch being set to true (as if by useInfiniteMovies)
        act(() => {
            result.current.setShouldFetch(true);
        });

        // Advance time past the original debounce period
        act(() => {
            jest.advanceTimersByTime(201); // Total time now 501ms
        });

        // shouldFetch should still be true (timeout was cleared)
        expect(result.current.shouldFetch).toBe(true);

        // Simulate intersection again
        act(() => {
            intersectionObserverCallback([{ isIntersecting: true }]);
        });

        // Advance time by debounce period
        await act(async () => {
            jest.advanceTimersByTime(500);
            await waitFor(() => expect(result.current.shouldFetch).toBe(true), { timeout: 1000 });
        });

        // shouldFetch should still be true (no change due to existing true value)
        expect(result.current.shouldFetch).toBe(true);
    });
});