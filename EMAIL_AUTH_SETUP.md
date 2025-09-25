# Email-Based Authentication Setup Guide

This guide explains how the email-based authentication system works in EduConnect.

## How It Works

The EduConnect system uses email and password authentication with the following features:

1. **Email Registration**: Users register with their email address and create a password
2. **Password Validation**: Passwords must be at least 6 characters long
3. **Email Verification**: New accounts require email verification before login
4. **JWT Authentication**: After login, users receive a JWT token for session management
5. **Role-Based Access**: Users can have roles like student, teacher, or admin

## Key Components

### Frontend Authentication
- Uses Supabase JavaScript client for authentication
- Handles login and registration forms
- Manages user sessions with localStorage/sessionStorage
- Provides real-time feedback to users

### Backend Authentication
- RESTful API endpoints for authentication
- User management with PostgreSQL database
- Password hashing with bcrypt
- JWT token generation and validation

## API Endpoints

### Registration
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "institution": "Example University",
  "role": "teacher"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user data */ },
    "token": "jwt-token"
  }
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user data */ },
    "token": "jwt-token"
  }
}
```

## Testing Authentication

To test the email-based authentication:

1. Open `email-auth-test.html` in your browser
2. Fill in the registration form with valid information
3. Submit the form to create a new account
4. Check the response to confirm successful registration
5. Use the same credentials to test login
6. Verify you receive a success message with user details

## Troubleshooting

### Common Issues

1. **Invalid email or password**
   - Check that you're using the correct email and password
   - Make sure the email is verified (check your inbox for verification link)

2. **User already exists**
   - Try logging in instead of registering
   - Use a different email address for registration

3. **Password too short**
   - Password must be at least 6 characters long

### Server Issues

If you get connection errors:
1. Make sure the server is running (`node server.js`)
2. Check that the API endpoints are accessible
3. Verify CORS configuration in `server.js`

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Tokens**: Secure session management with JSON Web Tokens
3. **Email Verification**: Prevents fake account creation
4. **Rate Limiting**: Protects against brute force attacks
5. **Input Validation**: Prevents injection attacks

## Customization

To modify the authentication behavior:

1. **Adjust password requirements**: Edit validation rules in `routes/auth.js`
2. **Change JWT expiration**: Modify `utils/jwt.js`
3. **Update email templates**: Check `services/emailService.js`
4. **Modify role permissions**: Update middleware in `middleware/auth.js`

## Support

For issues with authentication:
1. Check browser console for error messages
2. Verify server logs for backend errors
3. Ensure all environment variables are set correctly
4. Contact system administrator for persistent issues