/* eslint-disable no-shadow */
const card = require('../models/card');
const CardModel = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;

  CardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const getCards = (req, res) => {
  CardModel.find()
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const deleteCards = (req, res) => {
  CardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send(card);
    })
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const likeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const disLikeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCards,
  likeCard,
  disLikeCard,
};
