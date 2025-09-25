const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [200, 'Class name cannot exceed 200 characters']
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    ref: 'Branch'
  },
  year: {
    type: Number,
    required: [true, 'Academic year is required'],
    min: [1, 'Year must be at least 1'],
    max: [4, 'Year cannot exceed 4']
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
  },
  academicSession: {
    type: String,
    required: [true, 'Academic session is required'],
    trim: true,
    default: '2024-2025'
  },
  
  // Exam Details
  examType: {
    type: String,
    required: [true, 'Exam type is required'],
    enum: ['mid-term', 'end-term', 'practical', 'internal', 'viva', 'project'],
    default: 'mid-term'
  },
  examMonthYear: {
    type: String,
    required: [true, 'Exam month/year is required'],
    trim: true,
    default: 'June/July 2025'
  },
  
  // Center Details
  centerCode: {
    type: String,
    required: [true, 'Center code is required'],
    trim: true,
    uppercase: true,
    default: 'GN001'
  },
  centerName: {
    type: String,
    required: [true, 'Center name is required'],
    trim: true,
    default: 'Guru Nanak Dev Engineering College'
  },
  
  // Timing
  examTime: {
    type: String,
    required: [true, 'Exam time is required'],
    trim: true,
    default: '10:00 AM - 1:00 PM'
  },
  examDuration: {
    type: String,
    required: [true, 'Exam duration is required'],
    trim: true,
    default: '3 Hours'
  },
  
  // Instructions
  specialInstructions: {
    type: String,
    trim: true,
    default: '• Report to examination center 30 minutes before exam time\n• Carry valid photo ID proof along with this hall ticket\n• Mobile phones and electronic devices are strictly prohibited'
  },
  
  // Institution Details
  institutionName: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true,
    default: 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY, BELAGAVI'
  },
  examTitle: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
    default: 'ADMISSION TICKET FOR B.E EXAMINATION JUNE / JULY 2025'
  },
  
  // Logos
  collegeLogo: {
    type: String, // URL or base64 data
    default: null
  },
  universityLogo: {
    type: String, // URL or base64 data  
    default: null
  },
  
  // Customization
  primaryColor: {
    type: String,
    default: '#3B82F6'
  },
  secondaryColor: {
    type: String,
    default: '#1F2937'
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  fontFamily: {
    type: String,
    enum: ['helvetica', 'times', 'courier'],
    default: 'helvetica'
  },
  borderStyle: {
    type: String,
    enum: ['solid', 'double', 'dashed', 'dotted'],
    default: 'solid'
  },
  borderWidth: {
    type: String,
    enum: ['1', '2', '3'],
    default: '2'
  },
  layoutStyle: {
    type: String,
    enum: ['standard', 'compact', 'detailed'],
    default: 'standard'
  },
  paperSize: {
    type: String,
    enum: ['a4', 'letter', 'legal'],
    default: 'a4'
  },
  footerText: {
    type: String,
    trim: true,
    default: 'This is a computer-generated hall ticket and does not require signature'
  },
  showSignatureArea: {
    type: Boolean,
    default: true
  },
  showQRCode: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  totalStudents: {
    type: Number,
    default: 0,
    min: [0, 'Total students cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
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
classSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index for faster queries
classSchema.index({ branch: 1, year: 1, semester: 1, createdBy: 1 });
classSchema.index({ createdBy: 1, isActive: 1 });
classSchema.index({ name: 'text' }); // Text search index

// Virtual for full class name
classSchema.virtual('fullName').get(function() {
  return `${this.name} - ${this.year}${this.year === 1 ? 'st' : this.year === 2 ? 'nd' : this.year === 3 ? 'rd' : 'th'} Year - ${this.semester} Semester`;
});

module.exports = mongoose.model('Class', classSchema);