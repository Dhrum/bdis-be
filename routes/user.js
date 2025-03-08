const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getUsers, createUser, updateUser, deleteUser, updateProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/', protect, authorize('sa', 'uno'), getUsers);
router.post('/', protect, authorize('sa'), createUser);
router.put('/:userId', protect, authorize('sa', 'uno'), updateUser);
router.delete('/:userId', protect, authorize('sa'), deleteUser);
router.put('/profile', protect, updateProfile);

module.exports = router;
