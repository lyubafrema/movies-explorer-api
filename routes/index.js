const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { validateUserBody, validateLogin } = require('../middlewares/validators');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { HTTP_STATUS_NOT_FOUND } = require('../utils/constants');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateLogin, login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => next(new NotFoundError(HTTP_STATUS_NOT_FOUND)));

module.exports = router;
