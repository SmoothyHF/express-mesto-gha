/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
const card = require('../models/card');
const CardModel = require('../models/card');
const BadRequestError = require('../errors/badRequest-error');
const NotFoundError = require('../errors/notFound-error');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  CardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      next();
    });
};

const getCards = (req, res, next) => {
  CardModel.find()
    .then((cards) => res.status(200).send(cards))
    // .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
    .catch(next);
};

const deleteCards = (req, res, next) => {
  CardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        // return res.status(404).send({ message: 'Карточка с указанным id не найдена.' });
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name) {
        // return res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки' });
        return next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
      }
      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      next();
    });
};

const likeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        // return res.status(404).send({ message: 'Передан несуществующий id карточки.' });
        return next(new NotFoundError('Передан несуществующий id карточки.'));
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      }
      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      next();
    });
};

const disLikeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        // return res.status(404).send({ message: 'Передан несуществующий id карточки.' });
        return next(new NotFoundError('Передан несуществующий id карточки.'));
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      }
      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      next();
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCards,
  likeCard,
  disLikeCard,
};
