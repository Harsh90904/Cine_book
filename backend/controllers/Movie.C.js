const { NUMBER } = require('sequelize');
const Movie = require('../models/movie.M')
const  Show  = require('../models/Show.M');
const axios = require('axios')

const OMDB_API_KEY = process.env.OMDB_API_KEY

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

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({ order: [['created_at', 'DESC']] })
    res.json(movies)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
}


const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id)
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    res.json(movie)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
}

const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id)
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    await movie.update(req.body)
    res.json({ message: 'Movie updated successfully', movie })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
}

const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id)
    if (!movie) return res.status(404).json({ message: 'Movie not found' })
    await movie.destroy()
    res.json({ message: 'Movie deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
}

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