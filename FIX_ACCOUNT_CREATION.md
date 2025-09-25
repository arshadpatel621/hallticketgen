# How to Fix Account Creation and Email Issues

## Problem Summary

You're experiencing issues with:
1. Account creation not working properly
2. Email notifications not being sent during signup

## Root Causes

Based on our analysis, the issues are caused by:

1. **Incomplete Email Configuration**: The `.env` file contains placeholder values
2. **Missing Supabase Service Role Key**: Required for server-side operations
3. **Missing Bcrypt Configuration**: Needed for password hashing

## Step-by-Step Solution

### Step 1: Update Environment Variables

1. Open the `.env` file in your project
2. Update the following values with your actual credentials:

```env
# Email Configuration - UPDATE THESE VALUES
ADMIN_EMAIL=your-real-email@gmail.com
ADMIN_EMAIL_PASSWORD=your-app-password  # Generate an App Password, NOT your regular password

# Supabase Configuration - UPDATE THE SERVICE ROLE KEY
SUPABASE_URL=https://rhvvqpiazcnsmknsowrx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodnZxcGlhemNuc21rbnNvd3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTUwMDAsImV4cCI6MjA3MzQzMTAwMH0.tVVwDY42PuYVlMlgixMC4mbQ11_CMVKCTKjsVRW2YeA
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key  # Get this from Supabase Dashboard

# Optional: Add bcrypt rounds
BCRYPT_ROUNDS=12
```

### Step 2: Configure Gmail App Password (If using Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings > Security > App passwords
3. Generate a new app password for "Mail"
4. Copy the 16-character password
5. Paste it in the `ADMIN_EMAIL_PASSWORD` field in your `.env` file

### Step 3: Get Your Supabase Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Find the "service_role secret" (not the anon key)
4. Copy the full key
5. Paste it in the `SUPABASE_SERVICE_ROLE_KEY` field in your `.env` file

### Step 4: Test Your Configuration

We've provided several test scripts to verify your configuration:

#### Test Email Configuration
```bash
npm run test-email
```

#### Test Database Connection
```bash
npm run test-db
```

#### Test User Registration
```bash
npm run test-registration
```

### Step 5: Restart Your Server

After updating the configuration:
```bash
npm start
```

Or if you're using nodemon:
```bash
npm run dev
```

## Testing Account Creation

Once everything is configured, test account creation:

1. Open your browser and navigate to the registration page
2. Fill out the registration form with valid information
3. Submit the form
4. Check your email for notifications
5. Verify the user was created in your Supabase database

## Common Issues and Solutions

### Issue: "Invalid email or password"
**Solution**: Ensure you're using the correct credentials and that the user exists in the database.

### Issue: "User with this email already exists"
**Solution**: Try logging in instead of registering, or use a different email address.

### Issue: "Failed to send email"
**Solution**: 
1. Verify your email credentials are correct
2. Ensure you're using an App Password if using Gmail
3. Check that your email provider allows SMTP access

### Issue: "Missing Supabase environment variables"
**Solution**: Ensure all Supabase variables are properly set in your `.env` file.

## Additional Recommendations

1. **Use a proper email service**: For production, consider using SendGrid, AWS SES, or similar services instead of Gmail.

2. **Secure your environment variables**: Never commit your `.env` file to version control.

3. **Set up proper error logging**: Check server logs for detailed error messages.

4. **Test in development first**: Always test configuration changes in development before deploying to production.

## Support

If you continue to experience issues after following these steps:

1. Check the server console for detailed error messages
2. Verify all environment variables are correctly set
3. Ensure your Supabase project is properly configured
4. Contact support with detailed error messages and steps to reproduce

## Useful SQL Queries for Debugging

To check if users are being created in your database:
```sql
SELECT * FROM users;
```

To check login requests:
```sql
SELECT * FROM login_requests;
```

To manually create an admin user:
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