/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-shorthand */
/* eslint-disable arrow-parens */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
// const user = require('../models/user');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не могут быть пустыми' });
  }

  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(({
      name, about, avatar, email,
    }) => {
      res.status(201).send({
        name: name, about: about, avatar: avatar, email: email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Такой email уже зарегестрирован ' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не могут быть пустыми' });
  }

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: 'Такого пользователя не существует' });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).send({ token });
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getUserById = (req, res) => {
  // console.log(req.user._id);

  const id = req.params.userId;

  UserModel.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан несуществующий id.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const getCurrentUser = (req, res) => {
  // console.log(req.user._id);
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан несуществующий id.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserProfile = (req, res) => {
  UserModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserAvatar = (req, res) => {
  UserModel.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// const register = (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).send({ message: 'Email или пароль не могут быть пустыми' });
//   }

//   UserModel.create({ email, password })
//     .then((user) => res.status(200).send(user))
//     .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
// };

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  // register,
};
