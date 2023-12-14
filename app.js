const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const appRouter = require('./routes/index');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/notFound-error');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then();

const app = express();
const port = 3000;

app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(/^https?:\/\/(www\.)?([a-z0-9]{1}[a-z0-9-]*\.?)*\.{1}[a-z0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use(appRouter);

app.use((req, res, next) => next(new NotFoundError('Указан неверный адрес')));

app.use(errors());

app.use(errorHandler);

app.listen(port);
