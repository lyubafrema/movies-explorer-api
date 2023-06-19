const moviesRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieBody, validateId } = require('../middlewares/validators');

moviesRouter.delete('/:id', validateId, deleteMovie);
moviesRouter.post('/', validateMovieBody, createMovie);
moviesRouter.get('/', getMovies);

module.exports = moviesRouter;
