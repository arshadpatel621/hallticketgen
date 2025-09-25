const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Branch = require('../models/Branch');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/branches
 * @desc    Get all branches with optional filtering and search
 * @access  Public
 */
router.get('/', [
  query('search').optional().isString().withMessage('Search must be a string'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { search, isActive = true, page = 1, limit = 50 } = req.query;
    
    // Build query
    let query = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [branches, total] = await Promise.all([
      Branch.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name email'),
      Branch.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        branches,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/branches/:id
 * @desc    Get single branch by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const branch = await Branch.findOne({ 
      id: req.params.id.toUpperCase(),
      isActive: true 
    }).populate('createdBy', 'name email');

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.json({
      success: true,
      data: {
        branch
      }
    });

  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/branches
 * @desc    Create new branch
 * @access  Private (Teacher/Admin)
 */
router.post('/', authenticate, authorize('teacher', 'admin'), [
  body('id')
    .notEmpty()
    .withMessage('Branch ID is required')
    .isLength({ max: 10 })
    .withMessage('Branch ID cannot exceed 10 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Branch ID must contain only uppercase letters and numbers'),
  body('name')
    .notEmpty()
    .withMessage('Branch name is required')
    .isLength({ max: 200 })
    .withMessage('Branch name cannot exceed 200 characters'),
  body('icon')
    .optional()
    .isString()
    .withMessage('Icon must be a string'),
  body('color')
    .optional()
    .isIn(['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'teal', 'gray', 'orange', 'emerald', 'rose', 'amber', 'lime', 'cyan'])
    .withMessage('Invalid color'),
  body('students')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Student count must be a non-negative integer'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id, name, icon, color, students, description } = req.body;

    // Check if branch ID already exists
    const existingBranch = await Branch.findOne({ id: id.toUpperCase() });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'Branch with this ID already exists'
      });
    }

    // Create new branch
    const branch = new Branch({
      id: id.toUpperCase(),
      name,
      icon: icon || 'fas fa-graduation-cap',
      color: color || 'blue',
      students: students || 0,
      description,
      createdBy: req.user._id
    });

    await branch.save();

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: {
        branch
      }
    });

  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/branches/:id
 * @desc    Update branch
 * @access  Private (Teacher/Admin)
 */
router.put('/:id', authenticate, authorize('teacher', 'admin'), [
  body('name')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Branch name cannot exceed 200 characters'),
  body('icon')
    .optional()
    .isString()
    .withMessage('Icon must be a string'),
  body('color')
    .optional()
    .isIn(['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'teal', 'gray', 'orange', 'emerald', 'rose', 'amber', 'lime', 'cyan'])
    .withMessage('Invalid color'),
  body('students')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Student count must be a non-negative integer'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const branch = await Branch.findOne({ 
      id: req.params.id.toUpperCase(),
      isActive: true 
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Check if user can modify this branch (admin can modify any, teacher can modify their own)
    if (req.user.role !== 'admin' && branch.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this branch'
      });
    }

    const { name, icon, color, students, description } = req.body;

    // Update fields
    if (name !== undefined) branch.name = name;
    if (icon !== undefined) branch.icon = icon;
    if (color !== undefined) branch.color = color;
    if (students !== undefined) branch.students = students;
    if (description !== undefined) branch.description = description;

    await branch.save();

    res.json({
      success: true,
      message: 'Branch updated successfully',
      data: {
        branch
      }
    });

  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   DELETE /api/branches/:id
 * @desc    Delete (deactivate) branch
 * @access  Private (Teacher/Admin)
 */
router.delete('/:id', authenticate, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const branch = await Branch.findOne({ 
      id: req.params.id.toUpperCase(),
      isActive: true 
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Check if user can delete this branch
    if (req.user.role !== 'admin' && branch.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this branch'
      });
    }

    // Soft delete by setting isActive to false
    branch.isActive = false;
    await branch.save();

    res.json({
      success: true,
      message: 'Branch deleted successfully'
    });

  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/branches/seed
 * @desc    Seed default branches (for development/setup)
 * @access  Private (Admin only)
 */
router.post('/seed', authenticate, authorize('admin'), async (req, res) => {
  try {
    const defaultBranches = [
      { id: 'CSE', name: 'Computer Science Engineering', icon: 'fas fa-laptop-code', students: 1250, color: 'blue' },
      { id: 'AIML', name: 'Artificial Intelligence & Machine Learning', icon: 'fas fa-brain', students: 850, color: 'purple' },
      { id: 'ECE', name: 'Electronics & Communication', icon: 'fas fa-microchip', students: 890, color: 'green' },
      { id: 'MECH', name: 'Mechanical Engineering', icon: 'fas fa-cog', students: 980, color: 'yellow' },
      { id: 'CIVIL', name: 'Civil Engineering', icon: 'fas fa-building', students: 645, color: 'indigo' },
      { id: 'EEE', name: 'Electrical & Electronics', icon: 'fas fa-bolt', students: 756, color: 'red' },
      { id: 'CHEM', name: 'Chemical Engineering', icon: 'fas fa-flask', students: 432, color: 'pink' },
      { id: 'AERO', name: 'Aeronautical Engineering', icon: 'fas fa-plane', students: 298, color: 'cyan' },
      { id: 'AUTO', name: 'Automobile Engineering', icon: 'fas fa-car', students: 345, color: 'gray' },
      { id: 'IT', name: 'Information Technology', icon: 'fas fa-server', students: 567, color: 'teal' },
      { id: 'ISE', name: 'Information Science Engineering', icon: 'fas fa-database', students: 720, color: 'orange' },
      { id: 'BIOTECH', name: 'Biotechnology Engineering', icon: 'fas fa-dna', students: 380, color: 'emerald' },
      { id: 'TEXTILE', name: 'Textile Engineering', icon: 'fas fa-tshirt', students: 250, color: 'rose' },
      { id: 'MINING', name: 'Mining Engineering', icon: 'fas fa-mountain', students: 180, color: 'amber' },
      { id: 'INDUSTRIAL', name: 'Industrial Engineering', icon: 'fas fa-industry', students: 290, color: 'lime' }
    ];

    const branches = [];
    for (const branchData of defaultBranches) {
      const existingBranch = await Branch.findOne({ id: branchData.id });
      if (!existingBranch) {
        const branch = new Branch({
          ...branchData,
          createdBy: req.user._id
        });
        branches.push(branch);
      }
    }

    if (branches.length > 0) {
      await Branch.insertMany(branches);
    }

    res.json({
      success: true,
      message: `${branches.length} default branches created successfully`,
      data: {
        created: branches.length,
        total: defaultBranches.length
      }
    });

  } catch (error) {
    console.error('Seed branches error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;