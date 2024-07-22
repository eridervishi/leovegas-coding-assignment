import { configureStore } from "@reduxjs/toolkit"
import starredSlice from './starredSlice'
import watchLaterSlice from './watchLaterSlice'
import { moviesApi } from '../services/movies'

const store = configureStore({
    reducer: {
        [moviesApi.reducerPath]: moviesApi.reducer,
        starred: starredSlice,
        watchLater: watchLaterSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(moviesApi.middleware),
})

export default store
