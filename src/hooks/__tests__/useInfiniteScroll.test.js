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
});