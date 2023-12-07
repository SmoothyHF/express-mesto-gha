const router = require('express').Router();
const { celebrate, joi } = require('celebrate');
const {
  createCard,
  getCards,
  deleteCards,
  likeCard,
  disLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: joi.object().keys({
    name: joi.string().required().min(2).max(30),
    link: joi.string().required().uri().regex(/^https?:\/\/(www\.)?([a-z0-9]{1}[a-z0-9-]*\.?)*\.{1}[a-z0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: joi.object().keys({
    cardId: joi.string().length(24).hex().required(),
  }),
}), deleteCards);
router.put('/:cardId/likes', celebrate({
  params: joi.object().keys({
    cardId: joi.string().length(24).hex().required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: joi.object().keys({
    cardId: joi.string().length(24).hex().required(),
  }),
}), disLikeCard);

module.exports = router;
