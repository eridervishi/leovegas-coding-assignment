import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGetMovieDetailsQuery } from '../services/movies';
import TrailerModal from '../components/TrailerModal';
import { renderWithProviders } from './utils';

// Mock the useGetMovieDetailsQuery hook
jest.mock('../services/movies', () => ({
  useGetMovieDetailsQuery: jest.fn(),
}));

// Mock the YouTubePlayer component
jest.mock('../components/YoutubePlayer', () => () => <div data-testid="youtube-player">Mocked YouTube Player</div>);

describe('TrailerModal', () => {
  const mockOnClose = jest.fn();
  const mockMovieId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', async () => {
    useGetMovieDetailsQuery.mockReturnValue({ isLoading: true });
    render(<TrailerModal isOpen={false} onClose={mockOnClose} movieId={mockMovieId} />);
    expect(screen.queryByTestId('custom-modal-content')).not.toBeInTheDocument();    
  });

  it('renders loading state', () => {
    useGetMovieDetailsQuery.mockReturnValue({ isLoading: true });
    render(<TrailerModal isOpen={true} onClose={mockOnClose} movieId={mockMovieId} />);
    expect(screen.getByText('Loading trailer...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    useGetMovieDetailsQuery.mockReturnValue({ isError: true });
    render(<TrailerModal isOpen={true} onClose={mockOnClose} movieId={mockMovieId} />);
    expect(screen.getByText('Error loading trailer. Please try again.')).toBeInTheDocument();
  });

  it('renders YouTube player when trailer is available', () => {
    useGetMovieDetailsQuery.mockReturnValue({
      data: {
        title: 'Test Movie',
        videos: {
          results: [{ type: 'Trailer', key: 'test-key' }],
        },
      },
    });
    render(<TrailerModal isOpen={true} onClose={mockOnClose} movieId={mockMovieId} />);
    expect(screen.getByTestId('youtube-player')).toBeInTheDocument();
  });

  it('renders no trailer message when no trailer is available', () => {
    useGetMovieDetailsQuery.mockReturnValue({
      data: {
        title: 'Test Movie',
        videos: { results: [] },
      },
    });
    render(<TrailerModal isOpen={true} onClose={mockOnClose} movieId={mockMovieId} />);
    expect(screen.getByText('No trailer available. Try another movie.')).toBeInTheDocument();
  });

  it('calls onClose when clicking outside the modal', () => {
    useGetMovieDetailsQuery.mockReturnValue({ data: { title: 'Test Movie' } });
    render(<TrailerModal isOpen={true} onClose={mockOnClose} movieId={mockMovieId} />);
    fireEvent.click(screen.getByTestId('custom-modal-content').parentElement);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking the close button', () => {
    useGetMovieDetailsQuery.mockReturnValue({ data: { title: 'Test Movie' } });
    render(<TrailerModal isOpen={true} onClose={mockOnClose} movieId={mockMovieId} />);
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});