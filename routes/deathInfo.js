const express = require('express');
const { submitDeathInfo, getDeathInfo } = require('../controllers/deathInfoController');
const { protect, authorize } = require('../middlewares/authMiddleware'); // No longer needed for POST
const router = express.Router();

// Remove the protect and authorize middleware for POST route
router.post('/submit-death', submitDeathInfo); // Open to all users
router.get('/death-info', protect, authorize('unionAdmin', 'uno', 'sa'), getDeathInfo); // Keep authentication for GET route

module.exports = router;
