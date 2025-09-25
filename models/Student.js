const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    trim: true,
    uppercase: true
  },
  date: {
    type: String,
    trim: true
  },
  time: {
    type: String,
    trim: true
  }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  usn: {
    type: String,
    required: [true, 'USN is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'USN cannot exceed 20 characters']
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  admissionNumber: {
    type: String,
    required: [true, 'Admission number is required'],
    trim: true,
    maxlength: [20, 'Admission number cannot exceed 20 characters']
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
  photo: {
    type: String, // URL or base64 data
    default: null
  },
  subjects: [subjectSchema],
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  fatherName: {
    type: String,
    trim: true,
    maxlength: [100, 'Father name cannot exceed 100 characters']
  },
  motherName: {
    type: String,
    trim: true,
    maxlength: [100, 'Mother name cannot exceed 100 characters']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  category: {
    type: String,
    enum: ['General', 'OBC', 'SC', 'ST', 'Other']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
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
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for faster queries
studentSchema.index({ usn: 1 });
studentSchema.index({ branch: 1, year: 1, semester: 1 });
studentSchema.index({ classId: 1 });
studentSchema.index({ name: 'text' }); // Text search index

module.exports = mongoose.model('Student', studentSchema);