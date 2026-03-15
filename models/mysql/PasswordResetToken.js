import { getConnection } from "../../config/database.js";

export const PasswordResetToken = {
  /**
   * Insert a new reset token.
   * @param {number} userId
   * @param {string} token  - hex string from crypto.randomBytes(32)
   * @param {Date}   expiresAt
   */
  async create(userId, token, expiresAt) {
    const pool = await getConnection();
    const [result] = await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt],
    );
    return result.insertId;
  },

  /**
   * Find a valid (unexpired, unused) token row.
   * @param {string} token
   * @returns {Object|null}
   */
  async findByToken(token) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT * FROM password_reset_tokens
       WHERE token = ? AND used_at IS NULL AND expires_at > NOW()`,
      [token],
    );
    return rows[0] || null;
  },

  /**
   * Mark a token as used so it cannot be replayed.
   * @param {number} id - row id
   */
  async markUsed(id) {
    const pool = await getConnection();
    await pool.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?",
      [id],
    );
  },

  /**
   * Remove all expired tokens (call periodically or on demand).
   */
  async deleteExpired() {
    const pool = await getConnection();
    const [result] = await pool.query(
      "DELETE FROM password_reset_tokens WHERE expires_at < NOW()",
    );
    return result.affectedRows;
  },

  /**
   * Remove all tokens for a given user (before creating a new one).
   * @param {number} userId
   */
  async deleteByUserId(userId) {
    const pool = await getConnection();
    await pool.query("DELETE FROM password_reset_tokens WHERE user_id = ?", [
      userId,
    ]);
  },
};
