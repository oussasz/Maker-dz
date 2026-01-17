import { getConnection } from "../../config/database.js";
import argon2 from "argon2";

export const User = {
  // Find user by ID
  async findById(id) {
    const pool = await getConnection();
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  },

  // Find user by email
  async findByEmail(email) {
    const pool = await getConnection();
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email.toLowerCase(),
    ]);
    return rows[0] || null;
  },

  // Find user by username
  async findByUsername(username) {
    const pool = await getConnection();
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0] || null;
  },

  // Find users by role
  async findByRole(role) {
    const pool = await getConnection();
    const [rows] = await pool.query("SELECT * FROM users WHERE role = ?", [
      role,
    ]);
    return rows;
  },

  // Find user by Google ID
  async findByGoogleId(googleId) {
    const pool = await getConnection();
    const [rows] = await pool.query("SELECT * FROM users WHERE google_id = ?", [
      googleId,
    ]);
    return rows[0] || null;
  },

  // Create new user
  async create(userData) {
    const pool = await getConnection();

    let hashedPassword = null;
    if (userData.password) {
      hashedPassword = await argon2.hash(userData.password, {
        type: argon2.argon2id,
      });
    }

    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, google_id, auth_provider, role, first_name, last_name, phone, avatar, is_active, email_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.username,
        userData.email.toLowerCase(),
        hashedPassword,
        userData.googleId || null,
        userData.authProvider || "local",
        userData.role || "customer",
        userData.profile?.firstName || null,
        userData.profile?.lastName || null,
        userData.profile?.phone || null,
        userData.profile?.avatar || null,
        userData.isActive !== false,
        userData.emailVerified || false,
      ],
    );

    return { id: result.insertId, ...userData };
  },

  // Update user
  async updateById(id, updateData) {
    const pool = await getConnection();

    const fields = [];
    const values = [];

    if (updateData.username) {
      fields.push("username = ?");
      values.push(updateData.username);
    }
    if (updateData.email) {
      fields.push("email = ?");
      values.push(updateData.email.toLowerCase());
    }
    if (updateData.password) {
      const hashedPassword = await argon2.hash(updateData.password, {
        type: argon2.argon2id,
      });
      fields.push("password = ?");
      values.push(hashedPassword);
    }
    if (updateData.role) {
      fields.push("role = ?");
      values.push(updateData.role);
    }
    if (updateData.profile?.firstName !== undefined) {
      fields.push("first_name = ?");
      values.push(updateData.profile.firstName);
    }
    if (updateData.profile?.lastName !== undefined) {
      fields.push("last_name = ?");
      values.push(updateData.profile.lastName);
    }
    if (updateData.profile?.phone !== undefined) {
      fields.push("phone = ?");
      values.push(updateData.profile.phone);
    }
    if (updateData.profile?.avatar !== undefined) {
      fields.push("avatar = ?");
      values.push(updateData.profile.avatar);
    }
    if (updateData.isActive !== undefined) {
      fields.push("is_active = ?");
      values.push(updateData.isActive);
    }
    if (updateData.emailVerified !== undefined) {
      fields.push("email_verified = ?");
      values.push(updateData.emailVerified);
    }

    if (fields.length === 0) return null;

    values.push(id);
    await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return this.findById(id);
  },

  // Compare password
  async comparePassword(storedPassword, candidatePassword) {
    return await argon2.verify(storedPassword, candidatePassword);
  },

  // Delete user
  async deleteById(id) {
    const pool = await getConnection();
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // Find all users (with pagination)
  async findAll(options = {}) {
    const pool = await getConnection();
    const { limit = 10, offset = 0, role } = options;

    let query = "SELECT * FROM users";
    const values = [];

    if (role) {
      query += " WHERE role = ?";
      values.push(role);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    values.push(limit, offset);

    const [rows] = await pool.query(query, values);
    return rows;
  },
};

export default User;
