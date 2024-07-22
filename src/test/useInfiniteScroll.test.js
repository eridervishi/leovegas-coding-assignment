import { renderHook, act } from '@testing-library/react-hooks';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

describe('useInfiniteScroll', () => {
  let intersectionObserverMock;

  beforeEach(() => {
    intersectionObserverMock = jest.fn();
    intersectionObserverMock.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    });
    window.IntersectionObserver = intersectionObserverMock;
  });

  it('should set isFetching to true when intersecting', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useInfiniteScroll());

    expect(result.current.isFetching).toBe(false);

    act(() => {
      intersectionObserverMock.mock.calls[0][0]([
        { isIntersecting: true }
      ]);
    });

    await waitForNextUpdate();

    expect(result.current.isFetching).toBe(true);
  });

  it('should respect debounce time', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useInfiniteScroll({ debounceMs: 200 }));

    act(() => {
      intersectionObserverMock.mock.calls[0][0]([
        { isIntersecting: true }
      ]);
    });

    expect(result.current.isFetching).toBe(false);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isFetching).toBe(false);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isFetching).toBe(true);

    jest.useRealTimers();
  }, 10000); // Increase timeout for this specific test

  it('should clean up observer on unmount', () => {
    const disconnect = jest.fn();
    intersectionObserverMock.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect
    });

    const { unmount } = renderHook(() => useInfiniteScroll());

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});