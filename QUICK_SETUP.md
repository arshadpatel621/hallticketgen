# Quick Setup Guide - Users Table Only for Authentication

## 🚀 Simple 5-Step Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy your **Project URL** and **API Keys**

### Step 2: Environment Setup
Create `.env` file:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_random_secret_here
```

### Step 3: Install Dependencies
```bash
npm install @supabase/supabase-js pg
```

### Step 4: Create Users Table
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the content from `supabase-schema.sql`
3. Click "Run"

### Step 5: Test Your Setup
```bash
npm run dev
```

## 📋 What You Get

### Users Table Structure:
- `id` (UUID) - Primary key
- `name` (VARCHAR) - User's full name
- `email` (VARCHAR) - Unique email for login
- `password` (VARCHAR) - Hashed password
- `role` (ENUM) - admin, teacher, student
- `institution` (VARCHAR) - Institution name
- `phone` (VARCHAR) - Optional phone number
- `is_active` (BOOLEAN) - Account status
- `last_login` (TIMESTAMP) - Last login time
- `created_at` / `updated_at` (TIMESTAMP) - Timestamps

### Features Included:
✅ Password hashing with bcrypt  
✅ Email validation  
✅ Phone number validation  
✅ Role-based access (admin, teacher, student)  
✅ Account activation/deactivation  
✅ Last login tracking  
✅ Search functionality  
✅ Pagination support  
✅ User statistics  
✅ Row Level Security (RLS)  

### Sample Admin User:
The schema includes a sample admin user:
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** admin

> **Important:** Change this password in production!

## 🔧 Usage Examples

### Create a User:
```javascript
const UserModel = require('./models/UserSupabase');

const newUser = await UserModel.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword',
  institution: 'ABC College',
  role: 'teacher'
});
```

### Login Authentication:
```javascript
const user = await UserModel.findByEmail('john@example.com');
if (user && await UserModel.comparePassword('securepassword', user.password)) {
  await UserModel.updateLastLogin(user.id);
  // Login successful
}
```

### Get All Users:
```javascript
const result = await UserModel.findAll({
  page: 1,
  limit: 10,
  role: 'teacher',
  isActive: true
});
```

## 📁 Key Files:
- `supabase-schema.sql` - Database schema
- `config/supabase.js` - Database configuration
- `models/UserSupabase.js` - User model with all methods
- `.env.example` - Environment variables template

## 🔒 Security Features:
- Passwords are automatically hashed
- Row Level Security enabled
- Input validation with constraints
- Protected admin operations
- Secure session management

## 🛠️ Troubleshooting Common Issues

### Account Creation Not Working
1. Check that all environment variables are properly set in your `.env` file
2. Verify your Supabase credentials are correct
3. Ensure the Supabase service role key is properly configured
4. Check server logs for error messages

### Email Notifications Not Working
1. Verify your email configuration in `.env`:
   - `ADMIN_EMAIL` should be your actual email address
   - `ADMIN_EMAIL_PASSWORD` should be an App Password (not your regular password)
2. For Gmail, you need to generate an App Password:
   - Enable 2-Factor Authentication
   - Go to Google Account Settings > Security > App passwords
   - Generate a new app password for "Mail"
3. Test your email configuration:
   ```bash
   npm run test-email
   ```

### Database Connection Issues
1. Verify your Supabase URL and keys are correct
2. Test database connectivity:
   ```bash
   npm run test-db
   ```
3. Check that your Supabase project is not paused or over its usage limits

### User Registration Issues
1. Test the registration flow:
   ```bash
   npm run test-registration
   ```
2. Check that the users table was created properly in Supabase
3. Verify that Row Level Security policies are correctly set up

For detailed troubleshooting steps, see [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md) and [FIX_ACCOUNT_CREATION.md](FIX_ACCOUNT_CREATION.md).

This setup gives you a complete user authentication system ready for your hall ticket application!