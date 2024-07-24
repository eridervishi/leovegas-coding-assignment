import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './utils';
import WatchLater from '../components/WatchLater';
import { removeAllWatchLater } from '../data/watchLaterSlice';
import { act } from 'react-dom/test-utils';

// Mock the Movie component
jest.mock('../components/Movie', () => ({ movie, viewTrailer }) => (
  <div data-testid={`movie-${movie.id}`}>
    {movie.title}
    <button onClick={() => viewTrailer(movie.id)}>View Trailer</button>
  </div>
));

describe('WatchLater Component', () => {
  const viewTrailer = jest.fn();

  it('renders empty state when there are no watch later movies', async () => {
    await renderWithProviders(<WatchLater viewTrailer={viewTrailer} />, {
      preloadedState: {
        watchLater: { watchLaterMovies: [] }
      }
    });
    expect(screen.getByText('You have no movies saved to watch later.')).toBeInTheDocument();
    expect(screen.getByText('Home')).toHaveAttribute('href', '/');
  });

  it('renders watch later movies when present', async () => {
    await renderWithProviders(<WatchLater viewTrailer={viewTrailer} />, {
      preloadedState: {
        watchLater: {
          watchLaterMovies: [
            { id: 1, title: 'Movie 1' },
            { id: 2, title: 'Movie 2' },
          ]
        }
      }
    });

    expect(screen.getByText('Watch Later List')).toBeInTheDocument();
    expect(screen.getByTestId('movie-1')).toBeInTheDocument();
    expect(screen.getByTestId('movie-2')).toBeInTheDocument();
  });

  it('calls viewTrailer when "View Trailer" button is clicked', async () => {
    await renderWithProviders(<WatchLater viewTrailer={viewTrailer} />, {
      preloadedState: {
        watchLater: {
          watchLaterMovies: [{ id: 1, title: 'Movie 1' }]
        }
      }
    });

    await act(async () => {
      fireEvent.click(screen.getByText('View Trailer'));
    });
    expect(viewTrailer).toHaveBeenCalledWith(1);
  });

  it('dispatches clearAllWatchLater action when "Remove all watch later" button is clicked', async () => {
    const { getActions } = await renderWithProviders(<WatchLater viewTrailer={viewTrailer} />, {
      preloadedState: {
        watchLater: {
          watchLaterMovies: [{ id: 1, title: 'Movie 1' }]
        }
      }
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Empty list'));
    });

    const actions = getActions();
    expect(actions).toContainEqual(removeAllWatchLater());
  });
});