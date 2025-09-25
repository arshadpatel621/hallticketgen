# EduConnect Hall Ticket Generator - Simplified Version

This is a simplified version of the EduConnect Hall Ticket Generator with the login system removed. The application is now accessible directly without any authentication.

## Changes Made

1. **Removed Login Page**: The application now loads the main dashboard directly
2. **Removed Authentication**: All authentication requirements have been removed
3. **Simplified JavaScript**: Removed all authentication-related code
4. **Direct Access**: Users can access all features without logging in

## Files

- `index-simple.html`: The main application interface without login
- `script-simple.js`: Simplified JavaScript without authentication
- `server.js`: Updated to serve the simplified HTML file

## How to Use

1. Start the server as usual:
   ```
   npm start
   ```

2. Open your browser and go to `http://localhost:3000`

3. The main dashboard will load directly without any login required

## Features

- Dashboard with statistics
- Branch management
- Class management
- Student management
- Hall ticket generation

## Note

This simplified version is for demonstration purposes only. In a production environment, you would want to implement proper authentication and authorization for security reasons.

All data operations are currently mocked and don't connect to a real database in this simplified version.