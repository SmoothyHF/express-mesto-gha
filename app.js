const express = require('express');
const mongoose = require('mongoose');
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

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use(appRouter);

app.use((req, res) => {
  res.status(404).send({
    message: 'Указан неверный адрес',
  });
});

app.use(errorHandler);

app.listen(port);
