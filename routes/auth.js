const express = require('express');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/UserSupabase');
const LoginRequestModel = require('../models/LoginRequest');
const emailService = require('../services/emailService');
const { generateToken } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * Helper function to determine if login requires approval
 * @param {Object} user - User object
 * @param {string} clientIP - Client IP address
 * @param {string} userAgent - User agent string
 * @returns {boolean} - Whether approval is required
 */
async function shouldRequireApproval(user, clientIP, userAgent) {
  // For now, implement a simple policy:
  // 1. Always allow admin users (handled separately)
  // 2. Allow regular users unless there are suspicious patterns
  // 3. You can expand this logic based on your security requirements
  
  try {
    // Check for recent failed login attempts (if you track them)
    // Check for unusual IP patterns
    // Check for unusual user agent patterns
    // For demonstration, we'll use a simple rule:
    
    // If you want approval for ALL users, return true
    // If you want approval for NONE (except suspicious), return false
    // For now, let's allow normal logins and only require approval for specific cases
    
    // Example: Require approval if this is an admin email but from unknown location
    const isAdminEmail = user.email.includes('admin') || user.email.includes('mohammedarshad');
    
    // You can customize this logic based on your needs:
    // return isAdminEmail; // Only require approval for admin emails
    return false; // Allow all normal logins (approval system becomes opt-in)
    
  } catch (error) {
    console.error('Error checking approval requirements:', error);
    // On error, default to requiring approval for safety
    return true;
  }
}

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('institution')
    .notEmpty()
    .withMessage('Institution name is required'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage('Please enter a valid phone number'),
  body('role')
    .optional()
    .isIn(['admin', 'teacher', 'student'])
    .withMessage('Invalid role')
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

    const { name, email, password, institution, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists. Please login instead.'
      });
    }

    // Create new user
    const user = await UserModel.create({
      name,
      email,
      password,
      institution,
      phone,
      role: role || 'teacher'
    });

    // Generate JWT token for immediate access
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. You can now access your account.',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Request login approval (creates approval request instead of immediate login)
 * @access  Public
 */
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

    const { email, password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await UserModel.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // For email-based authentication, we allow direct login without approval
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Update last login
    await UserModel.updateById(user.id, { last_login: new Date().toISOString() });

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Login request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/direct-login
 * @desc    Direct login without approval (for testing or admin use)
 * @access  Public
 */
router.post('/direct-login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await UserModel.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Update last login
    await UserModel.updateById(user.id, { last_login: new Date().toISOString() });

    res.json({
      success: true,
      message: 'Direct login successful',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Direct login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, [
  body('name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage('Please enter a valid phone number'),
  body('institution')
    .optional()
    .notEmpty()
    .withMessage('Institution name cannot be empty')
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

    const { name, phone, institution } = req.body;

    const user = await UserModel.updateById(req.user.id, {
      name,
      phone,
      institution
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', authenticate, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
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

    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await UserModel.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await UserModel.updateById(user.id, { password: newPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/auth/login-status/:userId
 * @desc    Check user's login request status
 * @access  Public
 */
router.get('/login-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's pending request
    const pendingRequest = await LoginRequestModel.getUserPendingRequest(userId);
    
    if (!pendingRequest) {
      return res.json({
        success: true,
        data: {
          status: 'no_pending_request',
          message: 'No pending login request found'
        }
      });
    }

    // Check if request has expired
    if (new Date() > new Date(pendingRequest.expires_at)) {
      await LoginRequestModel.updateStatus(pendingRequest.id, 'expired');
      return res.json({
        success: true,
        data: {
          status: 'expired',
          message: 'Login request has expired. Please try logging in again.'
        }
      });
    }

    res.json({
      success: true,
      data: {
        status: pendingRequest.status,
        requestId: pendingRequest.id,
        requestedAt: pendingRequest.requested_at,
        expiresAt: pendingRequest.expires_at,
        message: pendingRequest.status === 'pending' 
          ? 'Your login request is pending approval from the administrator'
          : `Your login request has been ${pendingRequest.status}`
      }
    });

  } catch (error) {
    console.error('Login status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/auth/approve-login/:token
 * @desc    Approve or reject login request via email link
 * @access  Public
 */
router.get('/approve-login/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { action } = req.query; // 'approve' or 'reject'
    const adminNotes = req.query.notes || '';

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Invalid Action</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h1>❌ Invalid Action</h1>
          <p>Please use the correct approval or rejection links from the email.</p>
        </body>
        </html>
      `);
    }

    // Find the login request by token
    const loginRequest = await LoginRequestModel.findByToken(token);
    if (!loginRequest) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Request Not Found</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h1>❌ Request Not Found</h1>
          <p>This login request could not be found or may have expired.</p>
        </body>
        </html>
      `);
    }

    // Check if request is still pending
    if (loginRequest.status !== 'pending') {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Already Processed</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h1>⚠️ Already Processed</h1>
          <p>This login request has already been ${loginRequest.status}.</p>
          <p>Processed at: ${new Date(loginRequest.responded_at).toLocaleString()}</p>
        </body>
        </html>
      `);
    }

    // Check if request has expired
    if (new Date() > new Date(loginRequest.expires_at)) {
      await LoginRequestModel.updateStatus(loginRequest.id, 'expired');
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Request Expired</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h1>⏰ Request Expired</h1>
          <p>This login request has expired and cannot be processed.</p>
        </body>
        </html>
      `);
    }

    // Update the request status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const adminEmail = req.headers['admin-email'] || 'administrator'; // Could be set by middleware
    
    await LoginRequestModel.updateStatus(loginRequest.id, newStatus, adminEmail, adminNotes);

    // Send notification to user
    try {
      await emailService.sendLoginDecisionNotification(loginRequest, newStatus, adminNotes);
    } catch (emailError) {
      console.error('Failed to send decision notification:', emailError);
    }

    const isApproved = action === 'approve';
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Login ${isApproved ? 'Approved' : 'Rejected'}</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          .success { color: #4CAF50; }
          .rejected { color: #f44336; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .btn { display: inline-block; padding: 10px 20px; margin: 20px 10px; text-decoration: none; border-radius: 5px; color: white; }
          .btn-primary { background-color: #2196F3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="${isApproved ? 'success' : 'rejected'}">
            ${isApproved ? '✅ Login Approved' : '❌ Login Rejected'}
          </h1>
          <p><strong>User:</strong> ${loginRequest.user_name} (${loginRequest.user_email})</p>
          <p><strong>Decision:</strong> ${newStatus.toUpperCase()}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          ${isApproved ? 
            '<p>The user has been notified and can now access the website.</p>' : 
            '<p>The user has been notified of the rejection.</p>'
          }
          <a href="/admin/login-requests" class="btn btn-primary">📊 View All Requests</a>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Approval process error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
        <h1>❌ Error</h1>
        <p>An error occurred while processing the request. Please try again or contact support.</p>
      </body>
      </html>
    `);
  }
});

/**
 * @route   POST /api/auth/admin-decision
 * @desc    Admin approve/reject login request via API
 * @access  Private (Admin only)
 */
router.post('/admin-decision', authenticate, [
  body('requestId')
    .notEmpty()
    .withMessage('Request ID is required'),
  body('action')
    .isIn(['approve', 'reject'])
    .withMessage('Action must be approve or reject'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { requestId, action, notes } = req.body;

    // Find the login request
    const loginRequest = await LoginRequestModel.findById(requestId);
    if (!loginRequest) {
      return res.status(404).json({
        success: false,
        message: 'Login request not found'
      });
    }

    // Check if request is still pending
    if (loginRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request has already been ${loginRequest.status}`
      });
    }

    // Update the request status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await LoginRequestModel.updateStatus(requestId, newStatus, req.user.email, notes);

    // Send notification to user
    try {
      await emailService.sendLoginDecisionNotification(loginRequest, newStatus, notes);
    } catch (emailError) {
      console.error('Failed to send decision notification:', emailError);
    }

    res.json({
      success: true,
      message: `Login request ${newStatus} successfully`,
      data: {
        requestId,
        status: newStatus,
        adminEmail: req.user.email,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Admin decision error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/auth/login-requests
 * @desc    Get all login requests (Admin only)
 * @access  Private (Admin)
 */
router.get('/login-requests', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { page = 1, limit = 10, status, user_email } = req.query;
    
    const result = await LoginRequestModel.getAllRequests({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      user_email
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching login requests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/auth/login-stats
 * @desc    Get login request statistics (Admin only)
 * @access  Private (Admin)
 */
router.get('/login-stats', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const stats = await LoginRequestModel.getStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/expire-requests
 * @desc    Expire old pending requests (Admin only)
 * @access  Private (Admin)
 */
router.post('/expire-requests', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const expiredCount = await LoginRequestModel.expireOldRequests();

    res.json({
      success: true,
      message: `${expiredCount} requests expired successfully`,
      data: { expiredCount }
    });

  } catch (error) {
    console.error('Error expiring requests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/auth/check-user/:email
 * @desc    Check if user exists in database
 * @access  Public
 */
router.get('/check-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findByEmail(email);
    
    res.json({
      success: true,
      data: {
        exists: !!user,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          institution: user.institution,
          is_active: user.is_active,
          created_at: user.created_at
        } : null
      }
    });
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/fix-user-profile
 * @desc    Create or fix user profile in database
 * @access  Public
 */
router.post('/fix-user-profile', [
  body('email').isEmail().withMessage('Valid email required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('institution').notEmpty().withMessage('Institution is required'),
  body('role').isIn(['admin', 'teacher', 'student']).withMessage('Valid role required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, name, institution, role } = req.body;
    
    // Check if user already exists
    let user = await UserModel.findByEmail(email);
    
    if (user) {
      // Update existing user
      user = await UserModel.updateById(user.id, {
        name,
        institution,
        role,
        is_active: true
      });
    } else {
      // Create new user profile with default password
      user = await UserModel.create({
        name,
        email,
        password: 'TempPassword123!', // User will need to reset
        institution,
        role,
        is_active: true
      });
    }

    res.json({
      success: true,
      message: user.id ? 'User profile updated successfully' : 'User profile created successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Fix user profile error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to fix user profile: ${error.message}`
    });
  }
});

/**
 * @route   GET /api/auth/test-permissions
 * @desc    Test database permissions
 * @access  Public
 */
router.get('/test-permissions', async (req, res) => {
  try {
    // Test basic database connectivity
    const stats = await UserModel.getStats();
    
    res.json({
      success: true,
      message: 'Database permissions are working correctly',
      data: {
        userStats: stats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Permission test error:', error);
    res.status(500).json({
      success: false,
      message: `Database permission error: ${error.message}`
    });
  }
});

module.exports = router;