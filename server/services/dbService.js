import pg from 'pg';
import { getFirstEnv } from '../config/env.js';

const { Pool } = pg;

const connectionString = getFirstEnv('DATABASE_URL');

/**
 * PostgreSQL Connection Pool
 */
const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('render') || connectionString?.includes('neon') ? { rejectUnauthorized: false } : false
});

export const db = {
  query: (text, params) => pool.query(text, params),
  
  /**
   * Initialize database tables if they don't exist
   */
  async init() {
    if (!connectionString) {
      console.warn("Skipping DB Init: DATABASE_URL not provided.");
      return;
    }

    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        display_name VARCHAR(255),
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        description TEXT NOT NULL,
        city VARCHAR(100),
        result JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS meetings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        investor_name VARCHAR(255),
        scheduled_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vc_sessions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        persona VARCHAR(100),
        history JSONB,
        score JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.query(schema);
      console.log("PostgreSQL Schema Synchronized.");
    } catch (err) {
      console.error("PostgreSQL Init Error:", err);
    }
  }
};

export default db;
