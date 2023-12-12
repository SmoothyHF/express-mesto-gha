/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-shorthand */
/* eslint-disable arrow-parens */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const BadRequestError = require('../errors/badRequest-error');
const NotFoundError = require('../errors/notFound-error');
const ConflictError = require('../errors/conflict-error');
const ForbiddenError = require('../errors/Forbidden-error');

// const user = require('../models/user');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Email или пароль не могут быть пустыми'));
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
        return next(new ConflictError('Такой email уже зарегестрирован'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      next();
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Email или пароль не могут быть пустыми'));
  }

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new ForbiddenError('Такого пользователя не существует'));
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).send({ token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  UserModel.find()
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const id = req.params.userId;

  UserModel.findById(id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан несуществующий id.'));
      }
      next();
    });
};

const getCurrentUser = (req, res, next) => {
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан несуществующий id.'));
      }
      next();
    });
};

const updateUserProfile = (req, res, next) => {
  UserModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с указанным id не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      next();
    });
};

const updateUserAvatar = (req, res, next) => {
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
        return next(new NotFoundError('Пользователь с указанным id не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      }
      next();
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
