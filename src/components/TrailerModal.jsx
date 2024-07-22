import React from 'react';
import { useGetMovieDetailsQuery } from '../services/movies';
import YouTubePlayer from './YoutubePlayer';

const TrailerModal = ({ isOpen, onClose, movieId }) => {
    const { data: movieDetails, isLoading, isError } = useGetMovieDetailsQuery(movieId, {
        skip: !isOpen || !movieId,
    });

    if (!isOpen) return null;

    let content;
    if (isLoading) {
        content = <p>Loading trailer...</p>;
    } else if (isError) {
        content = <p>Error loading trailer. Please try again.</p>;
    } else if (movieDetails?.videos?.results?.length) {
        const trailer = movieDetails.videos.results.find(vid => vid.type === 'Trailer') || movieDetails.videos.results[0];
        content = <YouTubePlayer videoKey={trailer.key} />;
    } else {
        content = <p>No trailer available. Try another movie.</p>;
    }

    return (
        <div className="custom-modal-overlay" onClick={onClose}>
            <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
                <div className='modal-title'>
                    <h5>{movieDetails?.title}</h5>
                    <button className="custom-modal-close" onClick={onClose}>&times;</button>
                </div>
                {content}
            </div>
        </div>
    );
};

export default TrailerModal;