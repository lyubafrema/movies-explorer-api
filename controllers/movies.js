const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const Movie = require('../models/movie');
const {
  HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_FORBIDDEN, okCode,
} = require('../utils/constants');
const BadRequestError = require('../errors/bad-request-err');

// возвращаем все сохранённые текущим пользователем фильмы
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

// добавляем фильм
const createMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country, director, duration, year,
    description, image, trailerLink,
    thumbnail, movieId, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: _id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((newMovie) => {
      res.status(201).send(newMovie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(HTTP_STATUS_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

// удаляем фильм из списка сохраненных по id
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(HTTP_STATUS_NOT_FOUND);
      }
      if (movie.owner.toString() !== (req.user._id)) {
        throw new ForbiddenError(HTTP_STATUS_FORBIDDEN);
      }
      movie.deleteOne()
        .then(() => res.status(okCode).send({ message: 'Фильм успешно удален.' }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
