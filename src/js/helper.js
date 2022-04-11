import { API_IMAGE_URL } from './config';

export const getJSON = async function (url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(`Failure to return json data: ${err}`);
  }
};

export const getMovies = async function (results) {
  try {
    const movies = results.map(movie => {
      const posterPath = `${API_IMAGE_URL}${movie.poster_path}`;
      return {
        id: Number(movie.id),
        title: movie.title,
        poster: posterPath,
        isFavourite: false,
      };
    });
    return movies;
  } catch (err) {
    throw new Error(`Failure to return movie data: ${err}`);
  }
};
