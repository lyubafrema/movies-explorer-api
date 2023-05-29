const usersRouter = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validators');

usersRouter.patch('/me', validateUpdateUser, updateUser);
usersRouter.get('/me', getUser);

module.exports = usersRouter;
