const express = require('express');
const { submitBirthInfo, getBirthInfo } = require('../controllers/birthInfoController');
const { protect, authorize } = require('../middlewares/authMiddleware'); // No longer needed for POST
const router = express.Router();

// Remove the protect and authorize middleware for POST route
router.post('/submit-birth', submitBirthInfo); // Open to all users
router.get('/birth-info', protect, authorize('unionAdmin', 'uno', 'sa'), getBirthInfo); // Keep authentication for GET route

module.exports = router;
