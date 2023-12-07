/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, joi } = require('celebrate');

const appRouter = require('./routes/index');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/error-handler');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then();

const app = express();
const port = 3000;

app.use(express.json());

app.post('/signup', celebrate({
  body: joi.object().keys({
    name: joi.string().min(2).max(30),
    about: joi.string().min(2).max(30),
    avatar: joi.string().url().regex(/^https?:\/\/(www\.)?([a-z0-9]{1}[a-z0-9-]*\.?)*\.{1}[a-z0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    email: joi.string().required().email(),
    password: joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: joi.object().keys({
    email: joi.string().required().email(),
    password: joi.string().required(),
  }),
}), login);

app.use(auth);

app.use(appRouter);

app.use((req, res) => {
  res.status(404).send({
    message: 'Указан неверный адрес',
  });
});

app.use(errorHandler);

app.listen(port);
