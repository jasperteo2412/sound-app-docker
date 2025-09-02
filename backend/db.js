import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";

export async function initDatabase() {
  const db = await open({
    filename: "./data.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user', -- 'user' | 'admin'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS audio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        original_name TEXT NOT NULL,
        stored_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        description TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    const existing = await db.get('SELECT COUNT(*) as c FROM users');
    if (existing.c === 0) {
        const adminHash = await bcrypt.hash('password123', 10);
        const userHash = await bcrypt.hash('user123', 10);
        await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', adminHash, 'admin']);
        await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['user', userHash, 'user']);
    }
    return db;
}
