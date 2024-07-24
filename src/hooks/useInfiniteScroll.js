import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (options = {}) => {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        root = null,
        distance = '100px',
        debounceMs = 100
    } = options;

    const [shouldFetch, setShouldFetch] = useState(false);
    const observerRef = useRef(null);
    const timerRef = useRef(null);

    const handleIntersect = useCallback(
        ([entry]) => {
            if (entry.isIntersecting && !shouldFetch) {
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    setShouldFetch(true);
                }, debounceMs);
            } else {
                if (timerRef.current) clearTimeout(timerRef.current);
            }
        },
        [shouldFetch, debounceMs]
    );

    useEffect(() => {
        const options = {
            root,
            rootMargin: `0px 0px ${distance} 0px`,
            threshold,
        };

        const observer = new IntersectionObserver(handleIntersect, options);
        observerRef.current = observer;

        const sentinel = document.createElement('div');
        sentinel.style.width = '100%';
        sentinel.style.height = '1px';
        document.body.appendChild(sentinel);

        observer.observe(sentinel);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            observer.disconnect();
            sentinel.remove();
        };
    }, [handleIntersect, root, distance, threshold]);

    return { shouldFetch, setShouldFetch };
};