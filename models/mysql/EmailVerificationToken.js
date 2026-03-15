import { getConnection } from "../../config/database.js";

export const EmailVerificationToken = {
  async create(userId, token, expiresAt) {
    const pool = await getConnection();
    const [result] = await pool.query(
      "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt],
    );
    return result.insertId;
  },

  async findByToken(token) {
    const pool = await getConnection();
    const [rows] = await pool.query(
      `SELECT * FROM email_verification_tokens
       WHERE token = ? AND used_at IS NULL AND expires_at > NOW()`,
      [token],
    );
    return rows[0] || null;
  },

  async markUsed(id) {
    const pool = await getConnection();
    await pool.query(
      "UPDATE email_verification_tokens SET used_at = NOW() WHERE id = ?",
      [id],
    );
  },

  async deleteExpired() {
    const pool = await getConnection();
    const [result] = await pool.query(
      "DELETE FROM email_verification_tokens WHERE expires_at < NOW()",
    );
    return result.affectedRows;
  },

  async deleteByUserId(userId) {
    const pool = await getConnection();
    await pool.query(
      "DELETE FROM email_verification_tokens WHERE user_id = ?",
      [userId],
    );
  },
};
