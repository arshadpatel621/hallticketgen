# Hall Ticket Generator - Account Creation & Email Troubleshooting Guide

## Common Issues and Solutions

### 1. Email Notifications Not Working

**Problem**: Account creation emails are not being sent.

**Solutions**:

#### A. Configure Email Service
1. Update your `.env` file with correct email credentials:
   ```env
   ADMIN_EMAIL=your-real-email@gmail.com
   ADMIN_EMAIL_PASSWORD=your-app-password  # NOT your regular Gmail password
   BASE_URL=http://localhost:3000  # Update to your actual domain in production
   ```

2. For Gmail, you need to generate an "App Password":
   - Enable 2-Factor Authentication on your Google account
   - Go to Google Account Settings > Security > App passwords
   - Generate a new app password for "Mail"
   - Use this 16-character password in `ADMIN_EMAIL_PASSWORD`

#### B. Test Email Configuration
Run this command to test your email setup:
```bash
npm run test-email
```

### 2. Account Creation Issues

#### A. Check Supabase Configuration
1. Ensure your Supabase credentials are correct in `.env`:
   ```env
   SUPABASE_URL=your-actual-supabase-url
   SUPABASE_ANON_KEY=your-actual-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
   ```

2. Get your actual Supabase service role key:
   - Go to Supabase Dashboard
   - Project Settings > API
   - Copy the "service_role secret"

#### B. Database Connection Test
Run this command to test database connectivity:
```bash
npm run test-db
```

### 3. User Registration Flow

The current registration process works as follows:

1. User submits registration form
2. System checks if user already exists
3. If not, creates new user in database
4. Generates JWT token for immediate access
5. Returns success response with user data and token

### 4. Debugging Steps

#### A. Check Server Logs
Look for error messages in your terminal when running the server:
```bash
npm start
```

#### B. Test API Endpoints
Use tools like Postman or curl to test registration:

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

#### C. Check Database Directly
Verify users are being created in your Supabase database:
```sql
SELECT * FROM users;
```

### 5. Common Error Messages and Fixes

#### "Missing Supabase environment variables"
- Solution: Ensure all Supabase variables are set in `.env`

#### "Invalid email or password"
- Solution: Check that you're using the correct credentials

#### "User with this email already exists"
- Solution: Try logging in instead of registering

#### "Failed to send email"
- Solution: Check email configuration and credentials

### 6. Production Deployment Checklist

1. Update `BASE_URL` to your production domain
2. Use production Supabase credentials
3. Configure proper email service (consider using SendGrid, AWS SES, etc.)
4. Set strong JWT secret
5. Configure proper CORS settings
6. Set up SSL/HTTPS

### 7. Manual User Creation (Admin Only)

If you need to manually create a user:

1. Connect to your Supabase database
2. Run this SQL query:
   ```sql
   INSERT INTO users (name, email, password, role, institution, is_active)
   VALUES (
     'Admin User',
     'admin@example.com',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq8S/UW', -- password: admin123
     'admin',
     'Default Institution',
     true
   );
   ```

### 8. Support

If you continue to experience issues:
1. Check server console for error messages
2. Verify all environment variables are correctly set
3. Ensure your Supabase project is properly configured
4. Contact support with detailed error messages and steps to reproduce