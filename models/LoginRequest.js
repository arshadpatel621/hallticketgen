const { supabaseAdmin, handleSupabaseError } = require('../config/supabase');

class LoginRequestModel {
  
  // Create a new login request
  static async create(requestData) {
    const { data, error } = await supabaseAdmin
      .from('login_requests')
      .insert({
        user_id: requestData.user_id,
        user_email: requestData.user_email,
        user_name: requestData.user_name,
        request_ip: requestData.request_ip,
        user_agent: requestData.user_agent,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })
      .select()
      .single();

    handleSupabaseError(error);
    return data;
  }

  // Find login request by approval token
  static async findByToken(token) {
    const { data, error } = await supabaseAdmin
      .from('login_requests')
      .select('*')
      .eq('approval_token', token)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      handleSupabaseError(error);
    }
    return data;
  }

  // Find login request by ID
  static async findById(id) {
    const { data, error } = await supabaseAdmin
      .from('login_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      handleSupabaseError(error);
    }
    return data;
  }

  // Update login request status
  static async updateStatus(id, status, adminEmail = null, adminNotes = null) {
    const updateData = {
      status,
      responded_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (adminEmail) updateData.admin_email = adminEmail;
    if (adminNotes) updateData.admin_notes = adminNotes;

    const { data, error } = await supabaseAdmin
      .from('login_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    handleSupabaseError(error);
    return data;
  }

  // Get all pending login requests
  static async getPendingRequests(options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseAdmin
      .from('login_requests')
      .select('*', { count: 'exact' })
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })
      .range(offset, offset + limit - 1);

    handleSupabaseError(error);
    
    return {
      requests: data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }

  // Get all login requests with filters
  static async getAllRequests(options = {}) {
    const { page = 1, limit = 10, status, user_email } = options;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('login_requests')
      .select('*', { count: 'exact' })
      .order('requested_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);
    if (user_email) query = query.eq('user_email', user_email);

    const { data, error, count } = await query;
    handleSupabaseError(error);
    
    return {
      requests: data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }

  // Get user's pending request
  static async getUserPendingRequest(userId) {
    const { data, error } = await supabaseAdmin
      .from('login_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      handleSupabaseError(error);
    }
    return data;
  }

  // Check if user has a recent pending request (within last 30 minutes)
  static async hasRecentPendingRequest(userId) {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { data, error } = await supabaseAdmin
      .from('login_requests')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('requested_at', thirtyMinutesAgo)
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      handleSupabaseError(error);
    }
    return data && data.length > 0;
  }

  // Expire old pending requests
  static async expireOldRequests() {
    const { data, error } = await supabaseAdmin
      .rpc('expire_old_login_requests');

    handleSupabaseError(error);
    return data; // Returns number of expired requests
  }

  // Delete old processed requests (cleanup)
  static async deleteOldProcessedRequests(daysOld = 30) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString();
    
    const { error } = await supabaseAdmin
      .from('login_requests')
      .delete()
      .in('status', ['approved', 'rejected', 'expired'])
      .lt('created_at', cutoffDate);

    handleSupabaseError(error);
    return true;
  }

  // Get login request statistics
  static async getStats() {
    const { data: totalData, error: totalError } = await supabaseAdmin
      .from('login_requests')
      .select('*', { count: 'exact', head: true });

    const { data: pendingData, error: pendingError } = await supabaseAdmin
      .from('login_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { data: approvedData, error: approvedError } = await supabaseAdmin
      .from('login_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { data: rejectedData, error: rejectedError } = await supabaseAdmin
      .from('login_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    const { data: expiredData, error: expiredError } = await supabaseAdmin
      .from('login_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'expired');

    handleSupabaseError(totalError || pendingError || approvedError || rejectedError || expiredError);

    return {
      total: totalData.length,
      pending: pendingData.length,
      approved: approvedData.length,
      rejected: rejectedData.length,
      expired: expiredData.length
    };
  }
}

module.exports = LoginRequestModel;