const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { PORT, endpoint } = require('./config');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleDefaultErr = require('./errors/handle-default-err');
const limiter = require('./middlewares/limiter');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(handleDefaultErr);

mongoose.connect(endpoint);

app.listen(PORT, () => { console.log(`App started on port ${PORT}`); });
