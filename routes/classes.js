const express = require('express');
const Class = require('../models/Class');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/classes - Get all classes
router.get('/', authenticate, async (req, res) => {
  try {
    const classes = await Class.find({ 
      createdBy: req.user._id,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: { classes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/classes - Create new class
router.post('/', authenticate, async (req, res) => {
  try {
    const classData = new Class({
      ...req.body,
      createdBy: req.user._id
    });
    
    await classData.save();
    
    res.status(201).json({
      success: true,
      data: { class: classData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;