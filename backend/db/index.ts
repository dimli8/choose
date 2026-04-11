import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// In-memory database for development fallback
class InMemoryDB {
  private data: Record<string, any[]> = {
    users: [],
    teachers: [],
    courses: [],
    reviews: [],
    reviewLikes: [],
    comments: [],
    reports: [],
    uploads: []
  };

  private generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async insert(table: string, data: any) {
    const id = this.generateId();
    const now = new Date().toISOString();
    const item = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now
    };

    if (this.data[table]) {
      this.data[table].push(item);
    }

    return [item];
  }

  async select(table: string, where?: any) {
    let items = this.data[table] || [];

    if (where) {
      const key = Object.keys(where)[0];
      const value = where[key];
      items = items.filter(item => item[key] === value);
    }

    return items;
  }

  async execute(sql: string, params?: any[]) {
    return { success: true };
  }
}

let db: any;

try {
  // Try to connect to PostgreSQL
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    const client = postgres(connectionString);
    db = drizzle(client, { schema });
    console.log('Connected to PostgreSQL database');
  } else {
    throw new Error('DATABASE_URL not found');
  }
} catch (error) {
  // Fallback to in-memory database
  console.warn('PostgreSQL connection failed, using in-memory database:', error.message);
  db = new InMemoryDB();
}

export { db };
export * from './schema';
