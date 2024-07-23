import { renderHook, act } from '@testing-library/react-hooks';
import { useDebounce } from '../useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce the value change', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    act(() => {
      rerender({ value: 'changed', delay: 500 });
    });

    // The value shouldn't change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the value should be updated
    expect(result.current).toBe('changed');
  });

  it('should cancel debounce on unmount', () => {
    const { result, unmount, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    act(() => {
      rerender({ value: 'changed', delay: 500 });
    });

    unmount();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // The value should still be the initial one
    expect(result.current).toBe('initial');
  });
});