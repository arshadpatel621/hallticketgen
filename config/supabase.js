const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client for general use
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Create Supabase admin client for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database connection test
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};

// Helper function to handle Supabase errors
const handleSupabaseError = (error) => {
  if (error) {
    console.error('Supabase Error:', error);
    throw new Error(error.message || 'Database operation failed');
  }
};

// Database query helpers - focused on users table
const dbHelpers = {
  // User-specific methods
  async createUser(userData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    handleSupabaseError(error);
    return data;
  },

  async getUserById(id) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, institution, phone, is_active, last_login, created_at, updated_at')
      .eq('id', id)
      .single();
    
    handleSupabaseError(error);
    return data;
  },

  async getUserByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      handleSupabaseError(error);
    }
    return data;
  },

  async updateUser(id, updateData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, name, email, role, institution, phone, is_active, last_login, created_at, updated_at')
      .single();
    
    handleSupabaseError(error);
    return data;
  },

  async updateLastLogin(id) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, name, email, role, institution, phone, is_active, last_login, created_at, updated_at')
      .single();
    
    handleSupabaseError(error);
    return data;
  },

  async getAllUsers(options = {}) {
    const { page = 1, limit = 10, role, isActive } = options;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('users')
      .select('id, name, email, role, institution, phone, is_active, last_login, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (role) query = query.eq('role', role);
    if (isActive !== undefined) query = query.eq('is_active', isActive);

    const { data, error, count } = await query;
    handleSupabaseError(error);
    
    return {
      users: data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  },

  async searchUsers(searchTerm, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, institution, phone, is_active, last_login, created_at, updated_at', { count: 'exact' })
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    handleSupabaseError(error);
    
    return {
      users: data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  },

  async deleteUser(id) {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);
    
    handleSupabaseError(error);
    return true;
  },

  async getUserStats() {
    const { data: totalData, error: totalError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    const { data: activeData, error: activeError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
    
    const { data: teacherData, error: teacherError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'teacher');
    
    const { data: studentData, error: studentError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');

    handleSupabaseError(totalError || activeError || adminError || teacherError || studentError);
    
    return {
      total: totalData.length,
      active: activeData.length,
      inactive: totalData.length - activeData.length,
      roles: {
        admin: adminData.length,
        teacher: teacherData.length,
        student: studentData.length
      }
    };
  }
};

// Authentication helpers
const authHelpers = {
  async createAuthUser(userData) {
    const { email, password, name, institution, role } = userData;
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: {
        name: name,
        institution: institution,
        role: role
      },
      email_confirm: true
    });
    
    handleSupabaseError(error);
    return data;
  },
  
  async deleteAuthUser(userId) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    handleSupabaseError(error);
    return true;
  },
  
  async updateUserPassword(userId, newPassword) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });
    handleSupabaseError(error);
    return true;
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  testConnection,
  handleSupabaseError,
  dbHelpers,
  authHelpers
};