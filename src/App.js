import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import TrailerModal from './components/TrailerModal'
import './app.scss'

const App = () => {
  const [modalState, setModalState] = useState({ isOpen: false, movieId: null });

  const viewTrailer = (movieId) => {
    setModalState({ isOpen: true, movieId });
  }

  const closeModal = () => {
    setModalState({ isOpen: false, movieId: null });
  }

  return (
    <div className="App">
      <Header />

      <div className="container">
        <Routes>
          <Route path="/" element={<Movies viewTrailer={viewTrailer} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>

      <TrailerModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        movieId={modalState.movieId}
      />
    </div>
  )
}

export default App