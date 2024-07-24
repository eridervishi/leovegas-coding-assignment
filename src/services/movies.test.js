import { moviesApi } from '../services/movies';
import { setupApiStore } from '../test/utils';
import { waitFor } from '@testing-library/react';


describe('Movies API', () => {
    const storeRef = setupApiStore(moviesApi);

    it('fetches movies successfully', async () => {
        const result = await storeRef.store.dispatch(moviesApi.endpoints.getMovies.initiate({ searchTerm: '', page: 1 }));

        await waitFor(() => {
            expect(result.data).toBeDefined();
        });

        expect(result.data.results).toBeDefined();
        expect(Array.isArray(result.data.results)).toBe(true);
    });

    it('fetches movie details successfully', async () => {
        const movieId = 550; // Fight Club
        const result = await storeRef.store.dispatch(moviesApi.endpoints.getMovieDetails.initiate(movieId));

        await waitFor(() => {
            expect(result.data).toBeDefined();
        });

        expect(result.data.id).toBe(movieId);
        expect(result.data.title).toBeDefined();
    });

    it('handles no results when searching for non-existent movies', async () => {
        const result = await storeRef.store.dispatch(moviesApi.endpoints.getMovies.initiate({ searchTerm: 'nonexistentmovie123456789', page: 1 }));

        await waitFor(() => {
            expect(result.data).toBeDefined();
        });

        expect(result.data.results).toBeDefined();
        expect(Array.isArray(result.data.results)).toBe(true);
        expect(result.data.results.length).toBe(0);
        expect(result.data.total_results).toBe(0);
    });

    it('merges results correctly for pagination', async () => {
        // First page
        const result1 = await storeRef.store.dispatch(
            moviesApi.endpoints.getMovies.initiate({ searchTerm: '', page: 1 })
        );

        await waitFor(() => {
            expect(result1.data).toBeDefined();
        });

        const firstPageResults = result1.data.results;

        // Second page
        const result2 = await storeRef.store.dispatch(
            moviesApi.endpoints.getMovies.initiate({ searchTerm: '', page: 2 })
        );

        await waitFor(() => {
            expect(result2.data).toBeDefined();
        });

        expect(result2.data.results.length).toBeGreaterThan(firstPageResults.length);
        expect(result2.data.results).toEqual(expect.arrayContaining(firstPageResults));

        const total_results = firstPageResults.length + result2.data.results.length;

        const result1Search = await storeRef.store.dispatch(
            moviesApi.endpoints.getMovies.initiate({ searchTerm: 'fight', page: 1 })
        );
        await waitFor(() => {
            expect(result1Search.data).toBeDefined();
        });

        expect(result1Search.data.results.length).toBeLessThan(total_results);
    });


    it('fetches movie details with appended data', async () => {
        const movieId = 550; // Fight Club
        const result = await storeRef.store.dispatch(
            moviesApi.endpoints.getMovieDetails.initiate(movieId)
        );

        await waitFor(() => {
            expect(result.data).toBeDefined();
        });

        expect(result.data.id).toBe(movieId);
        expect(result.data.title).toBeDefined();
        expect(result.data.videos).toBeDefined();
    });

    describe('transformErrorResponse', () => {
        it('transforms error response for getMovies endpoint', async () => {
            const result = await storeRef.store.dispatch(moviesApi.endpoints.getMovies.initiate({ searchTerm: '', page: -1 }));

            await waitFor(() => {
                expect(result.data).toBeDefined();
            });

            expect(result.error).toEqual({
                status: 22,
                data: { message: 'Invalid page: Pages start at 1 and max at 500. They are expected to be an integer.' }
            });
        });

        it('transforms error response for getMovieDetails endpoint', async () => {
            const result = await storeRef.store.dispatch(
                moviesApi.endpoints.getMovieDetails.initiate(null)
            );

            expect(result.error).toEqual({
                status: 34,
                data: { message: 'The resource you requested could not be found.' }
            });
        });
    });
});