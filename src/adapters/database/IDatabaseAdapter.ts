import { BusinessData } from '../../automation/engine';

export interface IDatabaseAdapter {
  initialize(): Promise<void>;
  saveResults(results: BusinessData[]): Promise<void>;
  getAllResults(): Promise<BusinessData[]>;
  clearAll(): Promise<void>;
  getStats(): Promise<{
    total: number;
    withPhone: number;
    withWebsite: number;
    withAddress: number;
    categories: string[];
  }>;
}
