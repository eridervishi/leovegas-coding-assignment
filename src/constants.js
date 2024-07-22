export const API_KEY = '8cac6dec66e09ab439c081b251304443'

export const ENDPOINT = 'https://api.themoviedb.org/3'
export const ENDPOINT_DISCOVER = ENDPOINT + '/discover/movie?api_key=' + API_KEY + '&sort_by=vote_count.desc'
export const ENDPOINT_SEARCH = ENDPOINT + '/search/movie?api_key=' + API_KEY
export const ENDPOINT_MOVIE = ENDPOINT + '/movie/507086?api_key=' + API_KEY + '&append_to_response=videos'

export const API = {
    BASE_URL: 'https://api.themoviedb.org/3',
    KEY: API_KEY,
};

export const ENDPOINTS = {
    DISCOVER: '/discover/movie',
    SEARCH: '/search/movie',
    MOVIE: '/movie',
};

export const PARAMS = {
    SORT_BY_VOTE_COUNT: 'sort_by=vote_count.desc',
    APPEND_TO_RESPONSE: 'append_to_response=videos',
}; 