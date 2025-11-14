import { JSONFilePreset } from 'lowdb/node';
import * as path from 'path';
import { app } from 'electron';
import { BusinessData } from '../../automation/engine';
import { IDatabaseAdapter } from './IDatabaseAdapter';

interface Database {
  results: BusinessData[];
}

export class LowDBAdapter implements IDatabaseAdapter {
  private db: any;
  private dbPath: string;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'pegasus-atlas-db.json');
  }

  async initialize(): Promise<void> {
    if (!this.db) {
      const defaultData: Database = { results: [] };
      this.db = await JSONFilePreset(this.dbPath, defaultData);
    }
  }

  async saveResults(results: BusinessData[]): Promise<void> {
    await this.initialize();
    this.db.data.results.push(...results);
    await this.db.write();
  }

  async getAllResults(): Promise<BusinessData[]> {
    await this.initialize();
    return this.db.data.results;
  }

  async clearAll(): Promise<void> {
    await this.initialize();
    this.db.data.results = [];
    await this.db.write();
  }

  async getStats(): Promise<{
    total: number;
    withPhone: number;
    withWebsite: number;
    withAddress: number;
    categories: string[];
  }> {
    await this.initialize();
    const results = this.db.data.results;

    const categories: string[] = results
      .map((r: BusinessData) => r.category)
      .filter((c: string | undefined): c is string => !!c);
    
    const uniqueCategories: string[] = Array.from(new Set(categories));
    
    return {
      total: results.length,
      withPhone: results.filter((r: BusinessData) => r.phone).length,
      withWebsite: results.filter((r: BusinessData) => r.website).length,
      withAddress: results.filter((r: BusinessData) => r.address).length,
      categories: uniqueCategories,
    };
  }
}
