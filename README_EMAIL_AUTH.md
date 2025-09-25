# EduConnect Email-Based Authentication System

## Overview

The EduConnect platform now features a streamlined email-based authentication system that allows users to register and login using their email addresses and passwords. This system provides secure access to the platform without requiring manual approval for each login.

## Features

- ✅ Email and password authentication
- ✅ Password validation (minimum 6 characters)
- ✅ Email verification for new accounts
- ✅ JWT token-based sessions
- ✅ Role-based access control (student, teacher, admin)
- ✅ User profile management
- ✅ Remember me functionality

## How It Works

### Registration Flow
1. User fills in registration form with name, email, password, institution, and role
2. System validates input and checks for existing accounts
3. New user account is created with hashed password
4. User receives confirmation message and can immediately login

### Login Flow
1. User enters email and password
2. System validates credentials
3. If valid, JWT token is generated for session management
4. User is granted access to the platform

## Setup Instructions

### 1. Environment Configuration

Update the `.env` file with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

To get your Supabase credentials:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon key
4. For the service role key, scroll down to the "Service Role" section and copy that key

### 2. Database Setup

Run the SQL schema in `supabase-schema.sql` to set up the required tables:

```sql
-- This will create the users table and other necessary tables
```

### 3. Starting the Server

```bash
cd hall-ticket
npm install
node server.js
```

## Testing the Authentication

### Using the Test Page

Open `email-auth-test.html` in your browser to test registration and login functionality.

### Using API Endpoints

#### Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "institution": "Example University",
    "role": "teacher"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for secure session management
- Input validation to prevent injection attacks
- Rate limiting to prevent brute force attacks
- CORS configuration for secure API access

## Customization

### Modifying Validation Rules

Edit `routes/auth.js` to change validation requirements:
- Password length requirements
- Email format validation
- Role restrictions

### Adjusting JWT Settings

Modify `utils/jwt.js` to change:
- Token expiration time
- Token signing algorithm

### Updating UI

The login and registration forms are in `index.html`. You can customize:
- Form fields
- Styling
- Error messages

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure all required variables are set in `.env`
   - Check that there are no extra spaces or characters

2. **"Invalid email or password"**
   - Verify credentials are correct
   - Check that the user account exists

3. **"User already exists"**
   - Try logging in instead of registering
   - Use a different email address

### Server Logs

Check the terminal output for detailed error messages:
- Database connection issues
- Validation errors
- Authentication failures

## Support

For assistance with the authentication system:
1. Check the browser console for frontend errors
2. Review server logs for backend issues
3. Verify all environment variables are correctly set
4. Ensure the database is properly configured

## Files Overview

- `routes/auth.js` - Authentication API endpoints
- `models/UserSupabase.js` - User database operations
- `utils/jwt.js` - JWT token generation and validation
- `config/supabase.js` - Supabase client configuration
- `index.html` - Login and registration UI
- `script.js` - Frontend authentication logic
- `email-auth-test.html` - Test page for authentication
- `.env` - Environment configuration
- `supabase-schema.sql` - Database schema

The email-based authentication system is now ready for use. Users can register with their email addresses and immediately access the platform after successful authentication.