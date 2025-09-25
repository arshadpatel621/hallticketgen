# Login Approval System Setup Guide

## Overview
This guide will help you set up the login approval system where every user login requires your email approval.

## How It Works
1. **User attempts login** → System validates credentials and creates approval request
2. **Email sent to you** with user details and approve/reject buttons
3. **User sees "waiting for approval" message** with real-time status updates
4. **You approve/reject** via email links or admin dashboard
5. **User gets access** only after your approval

## Setup Steps

### 1. Database Setup
Run the updated SQL schema in your Supabase dashboard:
```bash
# The login_requests table has been added to supabase-schema.sql
# Execute this in your Supabase SQL Editor
```

### 2. Email Configuration
1. **Gmail Setup (Recommended):**
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate an App Password: https://support.google.com/accounts/answer/185833
   - Use this App Password in your .env file

2. **Create .env file:**
```bash
cp .env.example .env
```

3. **Update .env with your details:**
```env
ADMIN_EMAIL=your-email@gmail.com
ADMIN_EMAIL_PASSWORD=your-app-password
BASE_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
npm install nodemailer
```

### 4. Start the Server
```bash
npm start
```

## Usage

### For Users:
1. User enters credentials on login page
2. Sees "Awaiting Approval" modal with real-time status
3. Receives email notification when approved/rejected
4. Can login after approval

### For You (Admin):
1. **Email Notifications:** You'll receive emails with user details and approve/reject buttons
2. **Admin Dashboard:** Visit `/admin-dashboard.html` for a web interface
3. **Quick Actions:** Click approve/reject in emails for instant processing

## Admin Dashboard Features
- View all login requests (pending, approved, rejected, expired)
- Real-time statistics
- Approve/reject with admin notes
- Auto-refresh every 30 seconds
- Filter by status or email

## Security Features
- Requests expire after 24 hours
- Rate limiting prevents spam requests
- JWT tokens for secure API access
- Email validation and secure links
- Admin-only access to approval endpoints

## Testing
1. **Create a test user** via registration
2. **Try logging in** with that user
3. **Check your email** for approval notification
4. **Approve the request** via email or dashboard
5. **User should then be able to access** the website

## Customization Options

### Email Templates
Edit `services/emailService.js` to customize:
- Email styling and branding
- Approval/rejection messages
- Notification content

### Approval Expiry
Change expiry time in `models/LoginRequest.js`:
```javascript
expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
```

### Auto-approval for Admins
To bypass approval for admin users, modify `routes/auth.js`:
```javascript
// Skip approval for admin users
if (user.role === 'admin') {
  // Generate token and login immediately
}
```

## Troubleshooting

### Email Not Sending
1. Check Gmail App Password is correct
2. Verify ADMIN_EMAIL and ADMIN_EMAIL_PASSWORD in .env
3. Check server logs for email errors
4. Test email connection: add `emailService.testEmailConnection()` to server startup

### Database Errors
1. Ensure Supabase schema is updated
2. Check Supabase credentials in .env
3. Verify API keys have correct permissions

### Dashboard Not Loading
1. Check if server is running on correct port
2. Verify admin authentication
3. Check browser console for errors

## Production Deployment

### Environment Variables
Set in your hosting platform:
- `ADMIN_EMAIL`
- `ADMIN_EMAIL_PASSWORD`
- `BASE_URL` (your production domain)
- Supabase credentials

### Email Service
Consider upgrading to:
- **SendGrid** for high-volume emails
- **AWS SES** for cost-effective sending
- **Mailgun** for developer-friendly APIs

### Security
- Use strong JWT secrets
- Enable HTTPS in production
- Set up proper CORS policies
- Use environment variables for all secrets

## Support
For issues or questions:
1. Check server logs for error details
2. Verify all environment variables
3. Test email configuration separately
4. Check Supabase dashboard for data

## Next Steps
Once the basic approval system is working, you can:
1. Add SMS notifications
2. Implement approval workflows for different user roles
3. Add time-based auto-approval rules
4. Create mobile admin app
5. Add analytics and reporting