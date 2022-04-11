import {
  API_KEY,
  API_POPULAR_URL,
  API_SEARCH_URL,
  API_MOVIE_URL,
  API_USER_LOCALE,
  API_IMAGE_URL,
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
    const url = `${API_POPULAR_URL}api_key=${state.api_key}&language=${API_USER_LOCALE}&page=${state.movies.page}&include_adult=false`;
    const { page, results, total_pages, total_results } = await getJSON(url);
    state.movies.page = page;
    state.movies.totalPages = total_pages;
    state.movies.totalResults = total_results;
    state.movies.popular = await getMovies(results);
    return state.movies.popular;
  } catch (err) {
    throw new Error(`Retry: Can't access popular movies`);
  }
};

export const searchMovie = async function ({ query, year }) {
  try {
    const url = `${API_SEARCH_URL}api_key=${state.api_key}&language=${API_USER_LOCALE}&query=${query}&year=${year}&page=${state.search.page}&include_adult=false`;
    const { page, results, total_pages, total_results } = await getJSON(url);
    state.search.query = query;
    state.search.year = year;
    state.search.page = page;
    state.search.totalPages = total_pages;
    state.search.totalResults = total_results;
    state.search.movies = await getMovies(results);
    return state.search.movies;
  } catch (err) {
    throw new Error(`Retry: Can't access search results`);
  }
};

export const selectMovie = async function (movieId) {
  try {
    const url = `${API_MOVIE_URL}${movieId}?api_key=${state.api_key}&language=${API_USER_LOCALE}`;
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
    // Check popular movies pagination
    if (state.movies.totalPages > 0) {
      movies = state.movies;
      moviesUrl = `${API_POPULAR_URL}api_key=${state.api_key}&language=${API_USER_LOCALE}&page=${state.movies.page}&include_adult=false`;
    }
    // Check search movies pagination
    if (state.search.totalPages > 0) {
      movies = state.search;
      moviesUrl = `${API_SEARCH_URL}api_key=${state.api_key}&language=${API_USER_LOCALE}&query=${state.search.query}&year=${state.search.year}&page=${state.search.page}&include_adult=false`;
    }
    // Get the previous page
    if (page === 'previous') {
      movies.page--;
      movies.page = movies.page < 1 ? 1 : movies.page;
    }
    // Get the next page
    if (page === 'next') {
      movies.page++;
      movies.page =
        movies.page > movies.totalPages ? movies.totalPages : movies.page;
    }
    const { results } = await getJSON(moviesUrl);
    state.movies.popular = await getMovies(results);
    return state.movies.popular;
  } catch (err) {
    throw new Error(`Retry: Can't implement pagination movies`);
  }
};

export const addFavouriteMovie = async function (movieId) {
  try {
    // Check for favourite movies from popular and search
    state.movies.popular = state.movies.popular.map(movie => {
      if (movie.id === movieId) {
        movie.isFavourite = true;
      }
      return movie;
    });
    state.search.movies = state.search.movies.map(movie => {
      if (movie.id === movieId) {
        movie.isFavourite = true;
      }
      return movie;
    });
    /////////////////////////////////////////////////
    // Get favourite movie from popular and search
    const [popularMovie] = state.movies.popular.filter(
      movie => movie.id === movieId && movie.isFavourite
    );
    const [searchMovie] = state.search.movies.filter(
      movie => movie.id === movieId && movie.isFavourite
    );
    state.favourites.movies.push(popularMovie || searchMovie);
    // Return favourite movies
    return state.favourites.movies;
  } catch (error) {
    throw new Error(`Retry: Can't add movies to favourites`);
  }
};

export const removeFavouriteMovie = async function (movieId) {
  try {
    state.movies.popular = state.movies.popular.map(movie => {
      if (movie.id === movieId) {
        movie.isFavourite = false;
      }
      return movie;
    });
    state.search.movies = state.search.movies.map(movie => {
      if (movie.id === movieId) {
        movie.isFavourite = false;
      }
      return movie;
    });
    //////////////////////////////////////////////////////////
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
