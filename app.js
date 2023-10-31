const express = require('express');
const mongoose = require('mongoose');
const appRouter = require('./routes/index');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then();

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '653fb185afd584e777ec4d99',
  };

  next();
});

app.use(appRouter);

app.use((req, res) => {
  res.status(404).send({
    message: 'Указан неверный адрес',
  });
});

app.listen(port);
