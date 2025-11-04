const { Router } = require("express");
const { addMovie, getAllMovies, getMovieById, updateMovie, deleteMovie, getShowsByMovie } = require("../controllers/Movie.C");
const movieRouter = Router();

movieRouter.post("/", addMovie);
movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.patch("/:id", updateMovie);
movieRouter.delete("/:id", deleteMovie);
movieRouter.get("/:id/shows", getShowsByMovie);

module.exports = movieRouter;