require('dotenv').config();

const {
  PORT = 3100, NODE_ENV, JWT_SECRET, DB_URL,
} = process.env;
const defaultJwt = 'secret-key';
const DEV_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb';
const endpoint = NODE_ENV === 'production' ? DB_URL : DEV_URL;

module.exports = {
  PORT, JWT_SECRET, defaultJwt, endpoint,
};
