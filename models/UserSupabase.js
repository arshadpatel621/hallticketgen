const { dbHelpers, authHelpers, handleSupabaseError } = require('../config/supabase');
const bcrypt = require('bcryptjs');

class UserModel {
  // Create a new user
  static async create(userData) {
    try {
      // Hash password before saving
      if (userData.password) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
        userData.password = await bcrypt.hash(userData.password, salt);
      }

      const user = await dbHelpers.createUser({
        ...userData,
        email: userData.email.toLowerCase(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Remove password from returned user
      delete user.password;
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      return await dbHelpers.getUserById(id);
    } catch (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      return await dbHelpers.getUserByEmail(email);
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  // Get all users with pagination
  static async findAll(options = {}) {
    try {
      return await dbHelpers.getAllUsers(options);
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  // Update user
  static async updateById(id, updateData) {
    try {
      // Hash password if being updated
      if (updateData.password) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase();
      }

      return await dbHelpers.updateUser(id, updateData);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete user
  static async deleteById(id) {
    try {
      return await dbHelpers.deleteUser(id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Compare password
  static async comparePassword(candidatePassword, hashedPassword) {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
      throw new Error(`Password comparison failed: ${error.message}`);
    }
  }

  // Update last login
  static async updateLastLogin(id) {
    try {
      return await dbHelpers.updateLastLogin(id);
    } catch (error) {
      throw new Error(`Failed to update last login: ${error.message}`);
    }
  }

  // Search users by name or email
  static async search(searchTerm, options = {}) {
    try {
      return await dbHelpers.searchUsers(searchTerm, options);
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }

  // Get user statistics
  static async getStats() {
    try {
      return await dbHelpers.getUserStats();
    } catch (error) {
      throw new Error(`Failed to get user statistics: ${error.message}`);
    }
  }
}

module.exports = UserModel;