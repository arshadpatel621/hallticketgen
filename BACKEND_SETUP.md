# Hall Ticket Generator - Backend Setup Guide

## 🚀 Complete Backend Integration

This guide will help you set up and connect the backend to your existing hall ticket generator.

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either local installation or MongoDB Atlas account
- **Git** (optional, for version control)

## 🛠️ Installation Steps

### Step 1: Install Dependencies

Open PowerShell in your project directory and run:

```powershell
npm install
```

This will install all the required packages listed in `package.json`.

### Step 2: Database Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Your database URL will be: `mongodb://localhost:27017/hall_ticket_generator`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string (looks like): `mongodb+srv://username:password@cluster.mongodb.net/hall_ticket_generator`
4. Update the `.env` file with your connection string

### Step 3: Environment Configuration

The `.env` file is already created. Update the following values:

```env
# Database - Update this if using MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/hall_ticket_generator

# Security - Change this to a secure random string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email (optional) - For future features
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Step 4: Start the Server

```powershell
# Development mode (with auto-restart)
npm run dev

# OR Production mode
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Hall Ticket Generator Server
📍 Port: 3000
🌐 Environment: development
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Branches
- `GET /api/branches` - Get all branches
- `POST /api/branches` - Create new branch
- `PUT /api/branches/:id` - Update branch
- `DELETE /api/branches/:id` - Delete branch

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class

### File Upload
- `POST /api/upload/photo` - Upload student photo
- `POST /api/upload/excel` - Upload Excel/CSV file

### Health Check
- `GET /api/health` - Server health status

## 🔧 Testing the Backend

### 1. Test Health Endpoint
Open your browser and go to: `http://localhost:3000/api/health`

You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-01-12T...",
  "uptime": 123.45,
  "environment": "development"
}
```

### 2. Test User Registration
Use a tool like Postman or curl:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "institution": "Test Institution"
  }'
```

### 3. Access Your Website
Go to: `http://localhost:3000`

Your existing hall ticket generator will load and now has backend support!

## 📁 Project Structure

```
hall-ticket/
├── models/              # Database models
│   ├── User.js         # User authentication
│   ├── Branch.js       # Engineering branches
│   ├── Student.js      # Student information
│   └── Class.js        # Class/exam details
├── routes/              # API endpoints
│   ├── auth.js         # Authentication routes
│   ├── branches.js     # Branch management
│   ├── students.js     # Student management
│   ├── classes.js      # Class management
│   ├── halltickets.js  # Hall ticket generation
│   └── upload.js       # File upload handling
├── middleware/          # Express middleware
│   └── auth.js         # Authentication middleware
├── utils/               # Utility functions
│   └── jwt.js          # JWT token handling
├── uploads/             # File upload directory
├── server.js            # Main server file
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## 🔐 Authentication Flow

1. **Register/Login**: Users create accounts or sign in
2. **JWT Token**: Server issues a JWT token
3. **Protected Routes**: Token required for creating/managing data
4. **Role-Based Access**: Different permissions for admin/teacher/student

## 📊 Database Models

### User
- Authentication and profile information
- Roles: admin, teacher, student

### Branch
- Engineering branch details (CSE, ECE, etc.)
- Icons, colors, student counts

### Student
- Personal information, USN, subjects
- Photo storage, academic details

### Class
- Exam information, customization settings
- Institution details, logos

## 🔄 Next Steps for Frontend Integration

The final step is to update your existing JavaScript to use the backend APIs instead of localStorage. This involves:

1. Adding authentication to the frontend
2. Replacing localStorage calls with API calls
3. Adding error handling and loading states
4. Implementing photo upload functionality

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is busy, change the PORT in `.env`:
```env
PORT=3001
```

### MongoDB Connection Issues
- Check if MongoDB service is running
- Verify connection string in `.env`
- Check firewall/network settings

### Missing Dependencies
Run: `npm install` to ensure all packages are installed

## 🔒 Security Notes

- Change JWT_SECRET in production
- Use HTTPS in production
- Enable MongoDB authentication
- Set up proper CORS origins
- Use environment variables for sensitive data

## 📞 Support

For issues or questions:
- Email: arshadpatel1431@gmail.com

---
**Created by MAXIMUS Consultancy Service**