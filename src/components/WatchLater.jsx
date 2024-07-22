import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeAllWatchLater } from '../data/watchLaterSlice'
import Movie from './Movie'
import '../styles/starred.scss'

const WatchLater = ({ viewTrailer }) => {
    const dispatch = useDispatch()
    const watchLaterMovies = useSelector(state => state.watchLater.watchLaterMovies)

    const handleEmptyList = () => {
        dispatch(removeAllWatchLater())
    }

    if (watchLaterMovies.length === 0) {
        return (
            <div className="starred" data-testid="watch-later-div">
                <div className="text-center empty-cart">
                    <i className="bi bi-heart" />
                    <p>You have no movies saved to watch later.</p>
                    <p>Go to <Link to='/'>Home</Link></p>
                </div>
            </div>
        )
    }

    return (
        <div className="starred" data-testid="watch-later-div">
            <div data-testid="watch-later-movies" className="starred-movies">
                <h6 className="header">Watch Later List</h6>
                <div className="row">
                    {watchLaterMovies.map((movie) => (
                        <Movie 
                            movie={movie} 
                            key={movie.id}
                            viewTrailer={viewTrailer}
                        />
                    ))}
                </div>

                <footer className="text-center">
                    <button 
                        className="btn btn-primary" 
                        onClick={handleEmptyList}
                    >
                        Empty list
                    </button>
                </footer>
            </div>
        </div>
    )
}

export default WatchLater