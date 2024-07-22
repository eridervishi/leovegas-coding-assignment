import { renderHook, act } from '@testing-library/react-hooks';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce', () => {
  jest.useFakeTimers();

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce the value change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change the value
    rerender({ value: 'changed', delay: 500 });

    // The value shouldn't change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // The value still shouldn't have changed
    expect(result.current).toBe('initial');

    // Fast-forward time to just over the delay
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Now the value should have changed
    expect(result.current).toBe('changed');
  });

  it('should handle multiple rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'change1', delay: 500 });
    rerender({ value: 'change2', delay: 500 });
    rerender({ value: 'change3', delay: 500 });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('change3');
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});