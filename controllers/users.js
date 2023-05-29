require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET, defaultJwt } = require('../config');
const {
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_NOT_FOUND,
  updateDataOkCode,
} = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

// создаем пользователя
const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email,
      password: hash,
      name,
    })
      .then((newUser) => {
        res.status(201).send({
          email: newUser.email,
          name: newUser.name,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError(HTTP_STATUS_CONFLICT));
        } else if (err.name === 'ValidationError') {
          next(new BadRequestError(HTTP_STATUS_BAD_REQUEST));
        } else {
          next(err);
        }
      });
  })
    .catch(next);
};

// аутентификация
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(HTTP_STATUS_UNAUTHORIZED);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError(HTTP_STATUS_UNAUTHORIZED));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : defaultJwt,
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch(next);
};

// получаем текущего пользователя
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(HTTP_STATUS_NOT_FOUND);
      }
      const { email, name } = user;
      return res.send({ email, name });
    })
    .catch(next);
};

// обновляем информацию о юзере
const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { email, name } = req.body;

  User.findByIdAndUpdate(_id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(HTTP_STATUS_NOT_FOUND);
      }
      return res.status(updateDataOkCode).send({ message: 'Данные успешно обновлены.' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(HTTP_STATUS_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUser,
  updateUser,
};
