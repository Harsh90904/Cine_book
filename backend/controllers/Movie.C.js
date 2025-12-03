const { NUMBER } = require('sequelize');
const Movie = require('../models/movie.M')
const  Show  = require('../models/Show.M');
const axios = require('axios')

const OMDB_API_KEY = process.env.OMDB_API_KEY

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(movies);
  } catch (error) {
    console.error("Get Movies Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single movie
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error("Get Movie Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add movie (admin only)
const addMovie = async (req, res) => {
  try {
    const { title } = req.body
    if (!title) return res.status(400).json({ message: 'Title is required' })

    const movieExist = await Movie.findOne({ where: { title } })
    if (movieExist) return res.status(400).json({ message: 'Movie already exists' })

    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`
    const response = await axios.get(url)
    const data = response.data

    const movie = await Movie.create({
      title: data.Title || title,
      genre: data.Genre,
      duration: data.Runtime ? parseInt(data.Runtime) : null,
      language: data.Language,
      release_date: data.Released ? new Date(data.Released) : null,
      poster_url: data.Poster,
      Director: data.Director,
      Writer: data.Writer,
      Actors: data.Actors,
      Country: data.Country,
      Awards: data.Awards,
      Plot: data.Plot,
      imdbRating: data.imdbRating ? parseFloat(data.imdbRating) : null,
      imdbVotes: data.imdbVotes ? parseInt(data.imdbVotes.replace(NUMBER)) : null,
      imdbID: data.imdbID,
      Type: data.Type,
      BoxOffice: data.BoxOffice ? parseInt(data.BoxOffice.replace(NUMBER)) : null
    })

    res.status(201).json({ message: 'Movie added successfully', movie })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

// Update movie
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, genre, duration, release_date, rating, poster_url } = req.body;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movie.update({
      title: title || movie.title,
      description: description || movie.description,
      genre: genre || movie.genre,
      duration: duration || movie.duration,
      release_date: release_date || movie.release_date,
      rating: rating || movie.rating,
      poster_url: poster_url || movie.poster_url,
    });

    res.status(200).json({
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    console.error("Update Movie Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete movie
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movie.destroy();
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Delete Movie Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get shows by movie
const getShowsByMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [{ model: Show, as: 'shows' }]
    })
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    res.json({ movie_title: movie.title, shows: movie.shows })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
}

module.exports = {
    addMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
    getShowsByMovie
}