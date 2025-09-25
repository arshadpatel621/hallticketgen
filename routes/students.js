const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/students - Get all students
router.get('/', authenticate, async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .populate('branch')
      .populate('classId')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: { students }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/students - Create new student
router.post('/', authenticate, async (req, res) => {
  try {
    const student = new Student({
      ...req.body,
      createdBy: req.user._id
    });
    
    await student.save();
    
    res.status(201).json({
      success: true,
      data: { student }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Additional routes (PUT, DELETE, etc.) will be implemented here

module.exports = router;