/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
const card = require('../models/card');
const CardModel = require('../models/card');
const BadRequestError = require('../errors/badRequest-error');
const NotFoundError = require('../errors/notFound-error');
const ForbiddenError = require('../errors/Forbidden-error');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  CardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      next();
    });
};

const getCards = (req, res, next) => {
  CardModel.find()
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const deleteCards = (req, res, next) => {
  CardModel.findById(req.params.cardId)
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      }
    });
  CardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name) {
        return next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
      }
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
        return next(new NotFoundError('Передан несуществующий id карточки.'));
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      }
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
        return next(new NotFoundError('Передан несуществующий id карточки.'));
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      }
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
