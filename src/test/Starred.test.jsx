import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/utils';
import Starred from '../components/Starred';
import { clearAllStarred } from '../data/starredSlice';
import { act } from 'react-dom/test-utils';

// Mock the Movie component
jest.mock('../components/Movie', () => ({ movie, viewTrailer }) => (
  <div data-testid={`movie-${movie.id}`}>
    {movie.title}
    <button onClick={() => viewTrailer(movie.id)}>View Trailer</button>
  </div>
));

describe('Starred Component', () => {
  const viewTrailer = jest.fn();

  it('renders empty state when there are no starred movies', async () => {
    await renderWithProviders(<Starred viewTrailer={viewTrailer} />, {
      preloadedState: {
        starred: { starredMovies: [] }
      }
    });
    expect(screen.getByText('There are no starred movies.')).toBeInTheDocument();
    expect(screen.getByText('Home')).toHaveAttribute('href', '/');
  });

  it('renders starred movies when present', async () => {
    await renderWithProviders(<Starred viewTrailer={viewTrailer} />, {
      preloadedState: {
        starred: {
          starredMovies: [
            { id: 1, title: 'Movie 1' },
            { id: 2, title: 'Movie 2' },
          ]
        }
      }
    });

    expect(screen.getByText('Starred movies')).toBeInTheDocument();
    expect(screen.getByTestId('movie-1')).toBeInTheDocument();
    expect(screen.getByTestId('movie-2')).toBeInTheDocument();
  });

  it('calls viewTrailer when "View Trailer" button is clicked', async () => {
    await renderWithProviders(<Starred viewTrailer={viewTrailer} />, {
      preloadedState: {
        starred: {
          starredMovies: [{ id: 1, title: 'Movie 1' }]
        }
      }
    });

    await act(async () => {
      fireEvent.click(screen.getByText('View Trailer'));
    });
    expect(viewTrailer).toHaveBeenCalledWith(1);
  });

  it('dispatches clearAllStarred action when "Remove all starred" button is clicked', async () => {
    const { store, getActions } = await renderWithProviders(<Starred viewTrailer={viewTrailer} />, {
      preloadedState: {
        starred: {
          starredMovies: [{ id: 1, title: 'Movie 1' }]
        }
      }
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Remove all starred'));
    });

    const actions = getActions();
    expect(actions).toContainEqual(clearAllStarred());
  });
});