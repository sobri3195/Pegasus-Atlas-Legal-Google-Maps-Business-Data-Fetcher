import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import * as path from 'path';
import { app } from 'electron';
import { BusinessData } from '../../automation/engine';
import { IDatabaseAdapter } from './IDatabaseAdapter';

export class SQLiteAdapter implements IDatabaseAdapter {
  private db: Database | null = null;
  private dbPath: string;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'pegasus-atlas-db.sqlite');
  }

  async initialize(): Promise<void> {
    if (!this.db) {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database,
      });

      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS results (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          address TEXT,
          phone TEXT,
          website TEXT,
          category TEXT,
          lat REAL,
          lng REAL,
          metadata TEXT,
          timestamp INTEGER
        )
      `);
    }
  }

  async saveResults(results: BusinessData[]): Promise<void> {
    await this.initialize();
    if (!this.db) return;

    const stmt = await this.db.prepare(`
      INSERT INTO results (id, name, address, phone, website, category, lat, lng, metadata, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const result of results) {
      await stmt.run(
        result.id,
        result.name,
        result.address || null,
        result.phone || null,
        result.website || null,
        result.category || null,
        result.coordinates?.lat || null,
        result.coordinates?.lng || null,
        JSON.stringify(result.metadata || {}),
        result.timestamp
      );
    }

    await stmt.finalize();
  }

  async getAllResults(): Promise<BusinessData[]> {
    await this.initialize();
    if (!this.db) return [];

    const rows = await this.db.all('SELECT * FROM results');

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      address: row.address || undefined,
      phone: row.phone || undefined,
      website: row.website || undefined,
      category: row.category || undefined,
      coordinates: row.lat && row.lng ? { lat: row.lat, lng: row.lng } : undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      timestamp: row.timestamp,
    }));
  }

  async clearAll(): Promise<void> {
    await this.initialize();
    if (!this.db) return;

    await this.db.run('DELETE FROM results');
  }

  async getStats() {
    await this.initialize();
    if (!this.db) {
      return {
        total: 0,
        withPhone: 0,
        withWebsite: 0,
        withAddress: 0,
        categories: [],
      };
    }

    const total = await this.db.get('SELECT COUNT(*) as count FROM results');
    const withPhone = await this.db.get('SELECT COUNT(*) as count FROM results WHERE phone IS NOT NULL');
    const withWebsite = await this.db.get('SELECT COUNT(*) as count FROM results WHERE website IS NOT NULL');
    const withAddress = await this.db.get('SELECT COUNT(*) as count FROM results WHERE address IS NOT NULL');
    const categories = await this.db.all('SELECT DISTINCT category FROM results WHERE category IS NOT NULL');

    return {
      total: total.count,
      withPhone: withPhone.count,
      withWebsite: withWebsite.count,
      withAddress: withAddress.count,
      categories: categories.map(c => c.category),
    };
  }
}
