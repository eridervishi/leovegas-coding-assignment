import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/utils';
import { act } from 'react-dom/test-utils';
import Movies from '../components/Movies';
import * as hooks from '../hooks/useInfiniteMovies';

jest.mock('../hooks/useInfiniteMovies');

describe('Movies component', () => {
  it('renders loading state', async () => {
    hooks.useInfiniteMovies.mockReturnValue({
      movies: [],
      isLoading: true,
      isError: false,
      error: null,
      hasMore: false,
      isFetchingNextPage: false
    });

    await act(async () => {
      renderWithProviders(<Movies viewTrailer={() => {}} />);
    });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    hooks.useInfiniteMovies.mockReturnValue({
      movies: [],
      isLoading: false,
      isError: true,
      error: { status: 404, data: { message: 'Not found' } },
      hasMore: false,
      isFetchingNextPage: false
    });

    await act(async () => {
      renderWithProviders(<Movies viewTrailer={() => {}} />);
    });
    expect(screen.getByText('Error: 404 - Not found')).toBeInTheDocument();
  });

  it('renders movies', async () => {
    hooks.useInfiniteMovies.mockReturnValue({
      movies: [{ id: 1, title: 'Test Movie' }],
      isLoading: false,
      isError: false,
      error: null,
      hasMore: false,
      isFetchingNextPage: false
    });

    await act(async () => {
      renderWithProviders(<Movies viewTrailer={() => {}} />);
    });
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });
});