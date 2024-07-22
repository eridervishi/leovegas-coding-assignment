import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API, ENDPOINTS, PARAMS } from '../constants';

export const moviesApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API.BASE_URL,
        errorHandler: (error) => {
            console.error('API Error:', error);
            // we can dispatch a global error action here if needed
            // dispatch(setGlobalError(error));
        },
    }),
    endpoints: (builder) => ({
        getMovies: builder.query({
            query: (searchTerm = '') => {
                const endpoint = searchTerm ? ENDPOINTS.SEARCH : ENDPOINTS.DISCOVER;
                return `${endpoint}?api_key=${API.KEY}&query=${searchTerm}&${PARAMS.SORT_BY_VOTE_COUNT}`;
            },
            transformErrorResponse: (response, meta, arg) => {
                return { status: response.data.status_code, data: { message: response.data.status_message } };
            },
        }),
        getMovieDetails: builder.query({
            query: (movieId) => `${ENDPOINTS.MOVIE}/${movieId}?api_key=${API.KEY}&${PARAMS.APPEND_TO_RESPONSE}`,
            transformErrorResponse: (response, meta, arg) => {
                return { status: response.data.status_code, data: { message: response.data.status_message } };
            },
        }),
    }),
});

export const { useGetMoviesQuery, useGetMovieDetailsQuery } = moviesApi;