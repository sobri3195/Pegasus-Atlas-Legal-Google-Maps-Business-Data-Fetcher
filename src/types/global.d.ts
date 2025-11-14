export interface AppConfig {
  desktop: 'electron' | 'tauri';
  automation: 'puppeteer' | 'playwright' | 'selenium';
  parser: 'cheerio' | 'dom-inspector';
  database: 'lowdb' | 'sqlite';
}

export interface ElectronAPI {
  startSearch: (keyword: string, options: any) => Promise<any>;
  batchSearch: (keywords: string[], options: any) => Promise<any>;
  getResults: () => Promise<any>;
  cleanData: () => Promise<any>;
  exportData: (format: string, data: any[]) => Promise<any>;
  clearDatabase: () => Promise<any>;
  getConfig: () => Promise<{ success: boolean; data?: AppConfig; error?: string }>;
  onBatchProgress: (callback: (progress: any) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
