-- Supabase SQL Schema for Hall Ticket Generator - Users Only
-- Run these queries in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUM type for user roles (if not exists)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table for authentication (create if not exists)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'teacher',
    institution VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^\+?[\d\s\-\(\)]{10,15}$')
);

-- Create indexes for better performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_name ON users USING GIN(to_tsvector('english', name));

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to automatically update updated_at column (drop if exists, then create)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (only if not exists)
-- Password is 'admin123' - remember to change this in production
INSERT INTO users (name, email, password, role, institution)
SELECT 'Admin User', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq8S/UW', 'admin', 'Default Institution'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

-- Login Approval Requests table (create if not exists)
CREATE TABLE IF NOT EXISTS login_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    request_ip VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    approval_token UUID DEFAULT uuid_generate_v4(),
    admin_email VARCHAR(255), -- Email of admin who approved/rejected
    admin_notes TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for login_requests table (if not exists)
CREATE INDEX IF NOT EXISTS idx_login_requests_status ON login_requests(status);
CREATE INDEX IF NOT EXISTS idx_login_requests_user_id ON login_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_login_requests_token ON login_requests(approval_token);
CREATE INDEX IF NOT EXISTS idx_login_requests_expires ON login_requests(expires_at);

-- Add trigger to automatically update updated_at column for login_requests table (drop if exists, then create)
DROP TRIGGER IF EXISTS update_login_requests_updated_at ON login_requests;
CREATE TRIGGER update_login_requests_updated_at BEFORE UPDATE ON login_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically expire old login requests
CREATE OR REPLACE FUNCTION expire_old_login_requests()
RETURNS INTEGER AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    UPDATE login_requests 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'pending' AND expires_at < NOW();
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup via Supabase Auth
-- This creates a user profile in public.users when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, institution, is_active, created_at, updated_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'teacher'),
    COALESCE(new.raw_user_meta_data->>'institution', 'Default Institution'),
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (drop existing and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can view all users" ON users;
CREATE POLICY "Users can view all users" ON users FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE TO authenticated USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Admin can manage all users" ON users;
CREATE POLICY "Admin can manage all users" ON users FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin'
  )
);

-- Login requests policies (drop existing and recreate)
DROP POLICY IF EXISTS "Users can view their own login requests" ON login_requests;
CREATE POLICY "Users can view their own login requests" ON login_requests FOR SELECT TO authenticated USING (user_id = auth.uid()::uuid);

DROP POLICY IF EXISTS "Admin can manage all login requests" ON login_requests;
CREATE POLICY "Admin can manage all login requests" ON login_requests FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid()::uuid AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Public can create login requests" ON login_requests;
CREATE POLICY "Public can create login requests" ON login_requests FOR INSERT TO anon WITH CHECK (true);SELECT id, name, email, role, institution, is_active, last_login, created_at 
FROM users 
ORDER BY created_at DESC;