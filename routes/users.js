/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { celebrate, joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', celebrate({
  body: joi.object().keys({
    userId: joi.string().length(24).hex().required(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: joi.object.keys({
    name: joi.string().min(2).max(30).required(),
    about: joi.string().min(2).max(30).required(),
  }),
}), updateUserProfile);
router.patch('/me/avatar', celebrate({
  body: joi.object().keys({
    avatar: joi.string().url().regex(/^https?:\/\/(www\.)?([a-z0-9]{1}[a-z0-9-]*\.?)*\.{1}[a-z0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
  }),
}), updateUserAvatar);
module.exports = router;
