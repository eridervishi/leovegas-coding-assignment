import Movie from './Movie'
import '../styles/movies.scss'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteMovies } from '../hooks/useInfiniteMovies'


const Movies = ({ viewTrailer, closeCard }) => {
    const [searchParams] = useSearchParams()
    const searchTerm = searchParams.get('search') || ''

    const { movies, isLoading, isError, error, hasMore, isFetchingNextPage } = useInfiniteMovies(searchTerm, {
        distance: '200px',
        debounceMs: 200
    });

    if (isLoading && movies.length === 0) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.status} - {error.data.message || 'An error occurred'}</div>;
    }

    return (
        <div data-testid="movies" className="custom-grid">
            {movies?.map((movie) => (
                <Movie
                    movie={movie}
                    key={movie.id}
                    viewTrailer={viewTrailer}
                    closeCard={closeCard}
                />
            ))}
            {isFetchingNextPage && <div>Loading more...</div>}
            {!hasMore && <div>No more movies to load</div>}
        </div>
    )
}

export default Movies