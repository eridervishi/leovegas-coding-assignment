import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/utils';
import { act } from 'react-dom/test-utils';
import Movie from '../components/Movie';

const mockMovie = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test overview',
    release_date: '2023-01-01',
    poster_path: '/test-path.jpg'
};

describe('Movie component', () => {
    it('renders correctly', async () => {
        await act(async () => {
            renderWithProviders(<Movie movie={mockMovie} viewTrailer={() => {}} />);
        });
        expect(screen.getByText('Test Movie')).toBeInTheDocument();
        expect(screen.getByText('Test overview')).toBeInTheDocument();
        expect(screen.getByText('2023')).toBeInTheDocument();
    });

    it('calls viewTrailer when "View Trailer" button is clicked', async () => {
        const mockViewTrailer = jest.fn();
        await act(async () => {
            renderWithProviders(<Movie movie={mockMovie} viewTrailer={mockViewTrailer} />);
        });
        await act(async () => {
            fireEvent.click(screen.getByText('View Trailer'));
        });
        expect(mockViewTrailer).toHaveBeenCalledWith(1);
    });

    it('toggles star status when star button is clicked', async () => {
        await act(async () => {
            renderWithProviders(<Movie movie={mockMovie} viewTrailer={() => {}} />);
        });
        const starButton = screen.getByTestId('starred-link');
        await act(async () => {
            fireEvent.click(starButton);
        });
        expect(screen.getByTestId('unstar-link')).toBeInTheDocument();
    });

    it('toggles watch later status when watch later button is clicked', async () => {
        await act(async () => {
            renderWithProviders(<Movie movie={mockMovie} viewTrailer={() => {}} />);
        });
        const watchLaterButton = screen.getByTestId('watch-later');
        await act(async () => {
            fireEvent.click(watchLaterButton);
        });
        expect(screen.getByTestId('remove-watch-later')).toBeInTheDocument();
    });
});