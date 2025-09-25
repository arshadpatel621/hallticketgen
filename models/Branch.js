const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Branch ID is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Branch ID cannot exceed 10 characters']
  },
  name: {
    type: String,
    required: [true, 'Branch name is required'],
    trim: true,
    maxlength: [200, 'Branch name cannot exceed 200 characters']
  },
  icon: {
    type: String,
    required: [true, 'Branch icon is required'],
    default: 'fas fa-graduation-cap'
  },
  color: {
    type: String,
    required: [true, 'Branch color is required'],
    enum: ['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'teal', 'gray', 'orange', 'emerald', 'rose', 'amber', 'lime', 'cyan'],
    default: 'blue'
  },
  students: {
    type: Number,
    default: 0,
    min: [0, 'Student count cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt field before saving
branchSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for faster queries
branchSchema.index({ id: 1, isActive: 1 });
branchSchema.index({ name: 'text' }); // Text search index

module.exports = mongoose.model('Branch', branchSchema);