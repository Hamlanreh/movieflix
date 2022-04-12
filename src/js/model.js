import {
  API_KEY,
  API_POPULAR_URL,
  API_SEARCH_URL,
  API_MOVIE_URL,
  API_USER_LOCALE,
  API_IMAGE_URL,
  API_INCLUDE_ADULT,
} from './config';
import { getJSON, getMovies } from './helper';

export const state = {
  api_key: API_KEY,
  movies: {
    page: 1,
    totalPages: 0,
    totalResults: 0,
    popular: [],
  },
  search: {
    query: '',
    year: '',
    page: 1,
    totalPages: 0,
    totalResults: 0,
    movies: [],
  },
  favourites: {
    movies: [],
  },
};

export const getPopularMovies = async function () {
  try {
    // Generate the popular movie url
    const url = `${API_POPULAR_URL}api_key=${state.api_key}&language=${API_USER_LOCALE}&page=${state.movies.page}&include_adult=${API_INCLUDE_ADULT}`;
    // Get the popular movies data
    const { page, results, total_pages, total_results } = await getJSON(url);
    // Store the popular movies data
    state.movies.page = page;
    state.movies.totalPages = total_pages;
    state.movies.totalResults = total_results;
    state.movies.popular = await getMovies(results);
    // Return the popular movies
    return state.movies.popular;
  } catch (err) {
    throw new Error(`Retry: Can't access popular movies`);
  }
};

export const searchMovie = async function ({ query, year }) {
  try {
    // Generate the search movie url
    const url = `${API_SEARCH_URL}api_key=${state.api_key}&language=${API_USER_LOCALE}&query=${query}&year=${year}&page=${state.search.page}&include_adult=${API_INCLUDE_ADULT}`;
    // Get the search movies data
    const { page, results, total_pages, total_results } = await getJSON(url);
    // Store the search movies data
    state.search.query = query;
    state.search.year = year;
    state.search.page = page;
    state.search.totalPages = total_pages;
    state.search.totalResults = total_results;
    state.search.movies = await getMovies(results);
    // Return the search result movies
    return state.search.movies;
  } catch (err) {
    throw new Error(`Retry: Can't access search results`);
  }
};

export const selectMovie = async function (movieId) {
  try {
    // Generate the selected movie url
    const url = `${API_MOVIE_URL}${movieId}?api_key=${state.api_key}&language=${API_USER_LOCALE}`;
    // Get the selected movie data and destructure and restructure data
    const selectedMovie = await getJSON(url);
    if (!selectedMovie) return;
    const {
      id,
      title,
      poster_path,
      runtime,
      release_date,
      genres,
      tagline,
      spoken_languages,
      overview,
      popularity,
      vote_average,
      vote_count,
    } = selectedMovie;
    const genreList = genres.map(genre => genre.name);
    const languages = spoken_languages.map(language => {
      return language.english_name;
    });
    const posterPath = `${API_IMAGE_URL}${poster_path}`;
    // Return the selected movie data
    return {
      id,
      title,
      poster: posterPath,
      releaseDate: release_date,
      runtime,
      genres: genreList,
      languages,
      tagline,
      overview,
      popularity,
      voteAverage: vote_average,
      voteCount: vote_count,
    };
  } catch (err) {
    throw new Error(`Retry: Can't access selected movies`);
  }
};

export const pagination = async function (page) {
  try {
    let movies = {};
    let moviesUrl = '';
    // Check for popular movies pagination
    if (state.movies.totalPages > 0) {
      movies = state.movies;
      moviesUrl = `${API_POPULAR_URL}api_key=${state.api_key}&language=${API_USER_LOCALE}&page=${state.movies.page}&include_adult=${API_INCLUDE_ADULT}`;
    }
    // Check for search movies pagination
    if (state.search.totalPages > 0) {
      movies = state.search;
      moviesUrl = `${API_SEARCH_URL}api_key=${state.api_key}&language=${API_USER_LOCALE}&query=${state.search.query}&year=${state.search.year}&page=${state.search.page}&include_adult=${API_INCLUDE_ADULT}`;
    }
    // Go to the previous page
    if (page === 'previous') {
      movies.page--;
      movies.page = movies.page < 1 ? 1 : movies.page;
    }
    // Go to the next page
    if (page === 'next') {
      movies.page++;
      movies.page =
        movies.page > movies.totalPages ? movies.totalPages : movies.page;
    }
    // Get the page data
    const { results } = await getJSON(moviesUrl);
    state.movies.popular = await getMovies(results);
    // Render the page data
    return state.movies.popular;
  } catch (err) {
    throw new Error(`Retry: Can't implement pagination movies`);
  }
};

export const addFavouriteMovie = async function (movieId) {
  try {
    // Check for favourite movies from popular movies
    state.movies.popular = state.movies.popular.map(movie => {
      if (movie.id === movieId) {
        movie.isFavourite = true;
      }
      return movie;
    });
    // Check for favourite movies from search results
    state.search.movies = state.search.movies.map(movie => {
      if (movie.id === movieId) {
        movie.isFavourite = true;
      }
      return movie;
    });
    /////////////////////////////////////////////////
    // Get favourite movie from popular movies
    const [popularMovie] = state.movies.popular.filter(
      movie => movie.id === movieId && movie.isFavourite
    );
    // Get favourite movie from search results
    const [searchMovie] = state.search.movies.filter(
      movie => movie.id === movieId && movie.isFavourite
    );
    // Check and add either favourite popular movie or search movie
    state.favourites.movies.push(popularMovie || searchMovie);
    // Return favourite movies
    return state.favourites.movies;
  } catch (error) {
    throw new Error(`Retry: Can't add movies to favourites`);
  }
};

export const removeFavouriteMovie = async function (movieId) {
  try {
    // Check and remove selected favourite movie from popular movies
    state.movies.popular = state.movies.popular.map(movie => {
      if (movie.id === movieId) {
        movie.isFavourite = false;
      }
      return movie;
    });
    // Check and remove selected favourite movie from search results
    state.search.movies = state.search.movies.map(movie => {
      if (movie.id === movieId) {
        movie.isFavourite = false;
      }
      return movie;
    });
    //////////////////////////////////////////////////////////
    // Remove the selected movie from favourite movies
    state.favourites.movies = state.favourites.movies.filter(
      movie => movie.id !== Number(movieId)
    );
    // Return favourite movies
    return state.favourites.movies;
  } catch (error) {
    throw new Error(`Retry: Can't remove movies from favourites`);
  }
};

export const clearPopularMovies = async function () {
  try {
    // Clear and restore popular movies to default
    state.movies.page = 1;
    state.movies.totalPages = 0;
    state.movies.totalResults = 0;
    state.movies.popular = [];
  } catch (err) {
    throw new Error(`Retry: Can't clear popular movies`);
  }
};

export const clearSearch = async function () {
  try {
    // Clear and restore search results to default
    state.search.query = '';
    state.search.year = '';
    state.search.page = 1;
    state.search.totalPages = 0;
    state.search.totalResults = 0;
    state.search.movies = [];
  } catch (err) {
    throw new Error(`Retry: Can't clear search movies result`);
  }
};
