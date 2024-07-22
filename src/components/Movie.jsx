import { useDispatch, useSelector } from 'react-redux'
import { starMovie, unstarMovie } from '../data/starredSlice'
import { addToWatchLater, removeFromWatchLater } from '../data/watchLaterSlice'
import placeholder from '../assets/not-found-500X750.jpeg'

const Movie = ({ movie, viewTrailer }) => {
    const dispatch = useDispatch()
    const isStarred = useSelector(state => state.starred.starredMovies.some(m => m.id === movie.id))
    const isWatchLater = useSelector(state => state.watchLater.watchLaterMovies.some(m => m.id === movie.id))

    const handleCardClick = (e) => {
        e.currentTarget.classList.add('opened')
    }

    const handleCloseClick = (e) => {
        e.stopPropagation()
        e.target.closest('.card').classList.remove('opened')
    }

    const handleStarClick = () => {
        const action = isStarred ? unstarMovie(movie) : starMovie(movie)
        dispatch(action)
    }

    const handleWatchLaterClick = () => {
        const action = isWatchLater ? removeFromWatchLater(movie) : addToWatchLater(movie)
        dispatch(action)
    }

    return (
        <div className="wrapper col-3 col-sm-4 col-md-3 col-lg-3 col-xl-2">
            <div className="card" onClick={handleCardClick}>
                <div className="card-body text-center">
                    <div className="overlay" />
                    <div className="info_panel">
                        <div className="overview">{movie.overview}</div>
                        <div className="year">{movie.release_date?.substring(0, 4)}</div>
                        <span 
                            className="btn-star" 
                            data-testid={isStarred ? "unstar-link" : "starred-link"} 
                            onClick={handleStarClick}
                        >
                            <i className={`bi bi-star${isStarred ? '-fill' : ''}`} data-testid={isStarred ? "star-fill" : ""} />
                        </span>
                        <button 
                            type="button" 
                            data-testid={isWatchLater ? "remove-watch-later" : "watch-later"} 
                            className={`btn btn-light btn-watch-later${isWatchLater ? ' blue' : ''}`} 
                            onClick={handleWatchLaterClick}
                        >
                            {isWatchLater ? <i className="bi bi-check"></i> : 'Watch Later'}
                        </button>
                        <button type="button" className="btn btn-dark" onClick={() => viewTrailer(movie)}>View Trailer</button>                                                
                    </div>
                    <img className="center-block" src={(movie.poster_path) ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : placeholder} alt="Movie poster" />
                </div>
                <h6 className="title">{movie.title}</h6>
                <button type="button" className="close" onClick={handleCloseClick} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>        
    )
}

export default Movie