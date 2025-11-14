import { BusinessData } from '../automation/engine';
import { IDatabaseAdapter } from '../adapters/database/IDatabaseAdapter';
import { normalizeAddress, normalizePhone } from '../utils/helpers';

export class DataManager {
  private databaseAdapter: IDatabaseAdapter;

  constructor(databaseAdapter: IDatabaseAdapter) {
    this.databaseAdapter = databaseAdapter;
  }

  async initialize() {
    await this.databaseAdapter.initialize();
  }

  async saveResults(results: BusinessData[]) {
    await this.initialize();
    await this.databaseAdapter.saveResults(results);
  }

  async getAllResults(): Promise<BusinessData[]> {
    await this.initialize();
    return await this.databaseAdapter.getAllResults();
  }

  async cleanData(): Promise<BusinessData[]> {
    await this.initialize();

    const results = await this.databaseAdapter.getAllResults();

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

    await this.databaseAdapter.clearAll();
    await this.databaseAdapter.saveResults(cleaned);

    return cleaned;
  }

  async clearAll() {
    await this.initialize();
    await this.databaseAdapter.clearAll();
  }

  async getStats() {
    await this.initialize();
    return await this.databaseAdapter.getStats();
  }
}
