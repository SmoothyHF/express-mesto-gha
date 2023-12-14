const Card = require('../models/card');
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
      return next(err);
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
      if (!card) {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      return card;
    })
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        return CardModel.findByIdAndDelete(req.params.cardId)
          .then((deletedCard) => res.status(200).send(deletedCard))
          .catch(next);
      }
      return next(new ForbiddenError('Нельзя удалять чужие карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий id карточки.'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      }
      return next(err);
    });
};

const disLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий id карточки.'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      }
      return next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCards,
  likeCard,
  disLikeCard,
};
