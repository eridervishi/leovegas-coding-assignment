import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock child components
jest.mock('./components/Header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('./components/Movies', () => ({ viewTrailer }) => (
  <div data-testid="mock-movies">
    Movies
    <button onClick={() => viewTrailer(1)}>View Trailer</button>
  </div>
));
jest.mock('./components/Starred', () => () => <div data-testid="mock-starred">Starred</div>);
jest.mock('./components/WatchLater', () => () => <div data-testid="mock-watch-later">Watch Later</div>);
jest.mock('./components/TrailerModal', () => ({ isOpen, onClose, movieId }) => (
  isOpen ? (
    <div data-testid="mock-trailer-modal">
      Trailer Modal for movie {movieId}
      <button onClick={onClose}>Close</button>
    </div>
  ) : null
));

const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
};

describe('App Component', () => {
  test('renders Header component', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  test('renders Movies component on default route', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('mock-movies')).toBeInTheDocument();
  });

  test('renders Starred component on /starred route', () => {
    renderWithRouter(<App />, { route: '/starred' });
    expect(screen.getByTestId('mock-starred')).toBeInTheDocument();
  });

  test('renders WatchLater component on /watch-later route', () => {
    renderWithRouter(<App />, { route: '/watch-later' });
    expect(screen.getByTestId('mock-watch-later')).toBeInTheDocument();
  });

  test('renders "Page Not Found" for unknown routes', () => {
    renderWithRouter(<App />, { route: '/unknown' });
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  test('opens TrailerModal when viewTrailer is called', () => {
    renderWithRouter(<App />);
    fireEvent.click(screen.getByText('View Trailer'));
    expect(screen.getByTestId('mock-trailer-modal')).toBeInTheDocument();
    expect(screen.getByText('Trailer Modal for movie 1')).toBeInTheDocument();
  });

  test('closes TrailerModal when close button is clicked', () => {
    renderWithRouter(<App />);
    fireEvent.click(screen.getByText('View Trailer'));
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('mock-trailer-modal')).not.toBeInTheDocument();
  });
});