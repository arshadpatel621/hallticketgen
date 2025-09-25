# Supabase Configuration for Hall Ticket Generator

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

### 2. Run SQL Schema
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the content from `supabase-schema.sql`
4. Click "Run" to execute the schema

### 3. Update Environment Variables
Create a `.env` file in your project root with:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 4. Install Supabase Dependencies
Run the following command to install required packages:

```bash
npm install @supabase/supabase-js pg
npm install --save-dev @types/pg
```

### 5. Database Schema Overview

The schema includes the following tables:

#### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR(100))
- `email` (VARCHAR(255), Unique)
- `password` (VARCHAR(255))
- `role` (ENUM: admin, teacher, student)
- `institution` (VARCHAR(255))
- `phone` (VARCHAR(20))
- `is_active` (BOOLEAN)
- `last_login` (TIMESTAMP)
- `created_at`, `updated_at` (TIMESTAMP)

#### Branches Table
- `id` (UUID, Primary Key)
- `branch_id` (VARCHAR(10), Unique)
- `name` (VARCHAR(200))
- `icon` (VARCHAR(100))
- `color` (ENUM)
- `students` (INTEGER)
- `description` (VARCHAR(500))
- `is_active` (BOOLEAN)
- `created_by` (UUID, Foreign Key to users)
- `created_at`, `updated_at` (TIMESTAMP)

#### Classes Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR(200))
- `branch` (VARCHAR(10), Foreign Key to branches)
- `year` (INTEGER, 1-4)
- `semester` (ENUM)
- Exam details, center details, customization options
- `created_by` (UUID, Foreign Key to users)
- `created_at`, `updated_at` (TIMESTAMP)

#### Students Table
- `id` (UUID, Primary Key)
- `usn` (VARCHAR(20), Unique)
- `name` (VARCHAR(100))
- `admission_number` (VARCHAR(20))
- `branch` (VARCHAR(10), Foreign Key to branches)
- `year` (INTEGER, 1-4)
- `semester` (ENUM)
- Personal details (photo, email, phone, address, etc.)
- `class_id` (UUID, Foreign Key to classes)
- `created_by` (UUID, Foreign Key to users)
- `created_at`, `updated_at` (TIMESTAMP)

#### Subjects Table
- `id` (UUID, Primary Key)
- `student_id` (UUID, Foreign Key to students)
- `name` (VARCHAR(255))
- `code` (VARCHAR(20))
- `exam_date` (VARCHAR(50))
- `exam_time` (VARCHAR(50))
- `created_at` (TIMESTAMP)

### 6. Key Features

- **UUID Primary Keys**: More secure than incremental IDs
- **ENUM Types**: Type-safe for predefined values
- **Proper Foreign Keys**: Maintain referential integrity
- **Indexes**: Optimized for common queries
- **Triggers**: Automatic `updated_at` timestamp updates
- **Row Level Security**: Built-in security policies
- **Full-text Search**: GIN index on student names
- **Constraints**: Data validation at database level

### 7. Migration Notes

When migrating from MongoDB to PostgreSQL:
- MongoDB `_id` becomes UUID `id`
- Nested objects (like subjects in students) become separate tables
- MongoDB arrays become separate related tables
- Mongoose validations become PostgreSQL constraints
- Text search uses PostgreSQL's full-text search capabilities

### 8. Next Steps

After running the schema:
1. Update your backend code to use Supabase client instead of Mongoose
2. Update model files to use SQL queries instead of Mongoose schemas
3. Test the connection with sample data
4. Update your routes to use PostgreSQL queries

The schema is designed to maintain the same functionality as your MongoDB models while leveraging PostgreSQL's features for better performance and data integrity.