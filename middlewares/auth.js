const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { endpoint, JWT_SECRET, defaultJwt } = require('../config');
const { HTTP_STATUS_REQUIRED_AUTH } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(HTTP_STATUS_REQUIRED_AUTH));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, endpoint === 'production' ? JWT_SECRET : defaultJwt);
  } catch (err) {
    return next(new UnauthorizedError(HTTP_STATUS_REQUIRED_AUTH));
  }

  req.user = payload;
  return next();
};
