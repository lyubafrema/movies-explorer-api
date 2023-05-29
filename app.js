const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { mongoDbLink, PORT } = require('./config');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleDefaultErr = require('./errors/handle-default-err');
const NotFoundError = require('./errors/not-found-err');
const { HTTP_STATUS_NOT_FOUND } = require('./utils/constants');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(router);

app.use((req, res, next) => {
  next(new NotFoundError(HTTP_STATUS_NOT_FOUND));
});

app.use(errorLogger);
app.use(errors());
app.use(handleDefaultErr);

mongoose.connect(mongoDbLink);

app.listen(PORT, () => { console.log(`App started on port ${PORT}`); });
