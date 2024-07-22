import { moviesApi } from './movies';
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
});