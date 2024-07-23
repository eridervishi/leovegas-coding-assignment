import React from 'react';
import { render, screen } from '@testing-library/react';
import YoutubePlayer from '../components/YoutubePlayer';

// Mock ReactPlayer to avoid actual video loading
jest.mock('react-player', () => {
  return function DummyPlayer({ url, ...props }) {
    return <div data-testid="youtube-player" data-url={url} {...props} />;
  };
});

describe('YoutubePlayer', () => {
  const mockVideoKey = 'dQw4w9WgXcQ';

  it('renders the ReactPlayer component', () => {
    render(<YoutubePlayer videoKey={mockVideoKey} />);
    const player = screen.getByTestId('youtube-player');
    expect(player).toBeInTheDocument();
  });

  it('passes the correct URL to ReactPlayer', () => {
    render(<YoutubePlayer videoKey={mockVideoKey} />);
    const player = screen.getByTestId('youtube-player');
    expect(player).toHaveAttribute('data-url', `https://www.youtube.com/watch?v=${mockVideoKey}`);
  });

  it('sets the correct props on ReactPlayer', () => {
    render(<YoutubePlayer videoKey={mockVideoKey} />);
    const player = screen.getByTestId('youtube-player');
    expect(player).toHaveAttribute('width', '100%');
    expect(player).toHaveClass('video-player');
  });
});