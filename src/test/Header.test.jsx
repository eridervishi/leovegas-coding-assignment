import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/utils';
import Header from '../components/Header';
import { act } from 'react-dom/test-utils';

describe('Header component', () => {
  it('renders correctly', async () => {
    await renderWithProviders(<Header />);
    expect(screen.getByTestId('home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-starred')).toBeInTheDocument();
    expect(screen.getByText(/watch later/i)).toBeInTheDocument();
    expect(screen.getByTestId('search-movies')).toBeInTheDocument();
  });

  it('updates search params on input change', async () => {
    await renderWithProviders(<Header />);
    const searchInput = screen.getByTestId('search-movies');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test movie' } });
    });
    expect(searchInput.value).toBe('test movie');
  });

  it('displays star count when there are starred movies', async () => {
    await renderWithProviders(<Header />, {
      preloadedState: {
        starred: { starredMovies: [{ id: 1 }, { id: 2 }] }
      }
    });
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});