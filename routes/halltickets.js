const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/halltickets - Get hall tickets
router.get('/', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Hall tickets endpoint - to be implemented'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;