import { JSONFilePreset } from 'lowdb/node';
import * as path from 'path';
import { app } from 'electron';
import { BusinessData } from '../automation/engine';
import { normalizeAddress, normalizePhone } from '../utils/helpers';

interface Database {
  results: BusinessData[];
}

export class DataManager {
  private db: any;
  private dbPath: string;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'pegasus-atlas-db.json');
  }

  async initialize() {
    if (!this.db) {
      const defaultData: Database = { results: [] };
      this.db = await JSONFilePreset(this.dbPath, defaultData);
    }
  }

  async saveResults(results: BusinessData[]) {
    await this.initialize();
    
    this.db.data.results.push(...results);
    await this.db.write();
  }

  async getAllResults(): Promise<BusinessData[]> {
    await this.initialize();
    return this.db.data.results;
  }

  async cleanData(): Promise<BusinessData[]> {
    await this.initialize();
    
    const results = this.db.data.results;
    
    const normalized = results.map((item: BusinessData) => ({
      ...item,
      address: item.address ? normalizeAddress(item.address) : undefined,
      phone: item.phone ? normalizePhone(item.phone) : undefined,
    }));

    const uniqueMap = new Map<string, BusinessData>();
    
    for (const item of normalized) {
      const key = `${item.name}-${item.address || ''}-${item.phone || ''}`.toLowerCase();
      
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }
    
    const cleaned = Array.from(uniqueMap.values());
    
    this.db.data.results = cleaned;
    await this.db.write();
    
    return cleaned;
  }

  async clearAll() {
    await this.initialize();
    
    this.db.data.results = [];
    await this.db.write();
  }

  async getStats() {
    await this.initialize();
    
    const results = this.db.data.results;
    
    return {
      total: results.length,
      withPhone: results.filter((r: BusinessData) => r.phone).length,
      withWebsite: results.filter((r: BusinessData) => r.website).length,
      withAddress: results.filter((r: BusinessData) => r.address).length,
      categories: [...new Set(results.map((r: BusinessData) => r.category))],
    };
  }
}
