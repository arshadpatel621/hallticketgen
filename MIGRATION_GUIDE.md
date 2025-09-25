# Step-by-Step Supabase Migration Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project name: "hall-ticket-generator"
5. Create a strong database password
6. Choose your region (closest to your users)
7. Click "Create new project"
8. Wait for the project to be set up (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsI...`)
   - **service_role key** (starts with `eyJhbGciOiJIUzI1NiIsI...`)

## Step 3: Set Up Environment Variables

1. Create a `.env` file in your project root:
```bash
# Copy from .env.example and update these values:
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_long_random_secret_here
```

## Step 4: Install Dependencies

```bash
npm install @supabase/supabase-js pg
```

## Step 5: Create Database Schema

1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire content from `supabase-schema.sql`
5. Paste it into the SQL editor
6. Click "Run" (or press Ctrl+Enter)
7. Wait for all statements to execute successfully

## Step 6: Verify Schema Creation

1. Go to "Table Editor" in your Supabase dashboard
2. You should see these tables:
   - `users`
   - `branches`
   - `classes`
   - `students`
   - `subjects`

## Step 7: Test Connection

1. Update your `server.js` to test Supabase connection:

```javascript
// Add this to the top of server.js
const { testConnection } = require('./config/supabase');

// Add this after other middleware, before routes
testConnection().then(success => {
  if (!success) {
    console.error('Failed to connect to Supabase');
    process.exit(1);
  }
});
```

## Step 8: Run Your Application

```bash
npm install  # Install new dependencies
npm run dev  # Start the development server
```

## Step 9: Verify Everything Works

1. Check the console for "✅ Supabase connection successful"
2. If you see errors, check:
   - Your `.env` file has correct values
   - No typos in the Supabase URL or keys
   - The schema was created successfully

## Step 10: Update Your Routes (Gradual Migration)

You can now start updating your routes one by one. For example, to test the user model:

```javascript
// In routes/auth.js, you can test with:
const UserModel = require('../models/UserSupabase');

// Test creating a user:
app.post('/api/test-user', async (req, res) => {
  try {
    const user = await UserModel.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      institution: 'Test Institution',
      role: 'teacher'
    });
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error:**
   - Double-check your SUPABASE_URL and keys in .env
   - Ensure no extra spaces or quotes

2. **"relation does not exist" error:**
   - The schema wasn't created properly
   - Re-run the SQL schema in Supabase SQL Editor

3. **Connection timeout:**
   - Check your internet connection
   - Verify the Supabase project is active

4. **Permission errors:**
   - Make sure you're using the service_role key for server-side operations
   - Check if Row Level Security policies are correctly set

### Testing Queries:

You can test your database directly in Supabase SQL Editor:

```sql
-- Test inserting a user
INSERT INTO users (name, email, password, institution, role) 
VALUES ('Test User', 'test@example.com', 'hashed_password', 'Test College', 'teacher');

-- Test selecting users
SELECT id, name, email, role, created_at FROM users;

-- Test inserting a branch
INSERT INTO branches (branch_id, name, description) 
VALUES ('CS', 'Computer Science', 'Computer Science Department');
```

## Next Steps:

1. **Migrate Authentication**: Update your auth routes to use Supabase
2. **Migrate Models**: Replace Mongoose models with Supabase models
3. **Update Routes**: Update all API routes to use new models
4. **Test Functionality**: Test all features work with new database
5. **Deploy**: Deploy your updated application

## Migration Benefits:

- **Better Performance**: PostgreSQL is often faster than MongoDB for complex queries
- **ACID Compliance**: Better data integrity
- **Built-in Auth**: Supabase provides authentication out of the box
- **Real-time**: Built-in real-time subscriptions
- **SQL Power**: Complex queries and joins
- **Automatic APIs**: REST and GraphQL APIs auto-generated
- **Dashboard**: Built-in admin dashboard for data management

Remember to backup your MongoDB data before fully switching to ensure no data loss during migration!