import Movie from './Movie'
import '../styles/movies.scss'
import { useGetMoviesQuery } from '../services/movies'
import { useSearchParams } from 'react-router-dom'

const Movies = ({ viewTrailer, closeCard }) => {
    const [searchParams] = useSearchParams()
    const { data: movies, isLoading, isError, error } = useGetMoviesQuery(searchParams.get('search'))

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.status} - {error.data.message || 'An error occurred'}</div>;
    }

    return (
        <div data-testid="movies">
            {movies.results?.map((movie) => {
                return (
                    <Movie
                        movie={movie}
                        key={movie.id}
                        viewTrailer={viewTrailer}
                        closeCard={closeCard}
                    />
                )
            })}
        </div>
    )
}

export default Movies