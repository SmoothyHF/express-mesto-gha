const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);
module.exports = router;
