import { useState, useEffect } from 'react'
import { Link, NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'
import { useSearchParams, createSearchParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'

import '../styles/header.scss'

const Header = () => {

  const [searchParams, setSearchParams] = useSearchParams()
  const starredNr = useSelector((state) => state.starred.starredMovies.length)

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    setSearchParams(debouncedSearchTerm ? createSearchParams({ search: debouncedSearchTerm }) : '')
  }, [debouncedSearchTerm, setSearchParams])

  return (
    <header>
      <Link to="/" data-testid="home" onClick={() => setSearchParams('')}>
        <i className="bi bi-film" />
      </Link>

      <nav>
        <NavLink to="/starred" data-testid="nav-starred" className="nav-starred">
          {starredNr > 0 ? (
            <>
              <i className="bi bi-star-fill bi-star-fill-white" />
              <sup className="star-number">{starredNr}</sup>
            </>
          ) : (
            <i className="bi bi-star" />
          )}
        </NavLink>
        <NavLink to="/watch-later" className="nav-fav">
          watch later
        </NavLink>
      </nav>

      <div className="input-group rounded">

        <input type="search" data-testid="search-movies"
          onKeyUp={handleSearch}
          defaultValue={searchParams.get('search')}
          className="form-control rounded"
          placeholder="Search movies..."
          aria-label="Search movies"
          aria-describedby="search-addon"
          va
        />

      </div>
    </header>
  )
}

export default Header
