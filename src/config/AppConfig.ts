export type AutomationEngine = 'puppeteer' | 'playwright' | 'selenium';
export type ParserEngine = 'cheerio' | 'dom-inspector';
export type DatabaseEngine = 'lowdb' | 'sqlite';
export type DesktopFramework = 'electron' | 'tauri';

export interface AppConfig {
  desktop: DesktopFramework;
  automation: AutomationEngine;
  parser: ParserEngine;
  database: DatabaseEngine;
}

const defaultConfig: AppConfig = {
  desktop: 'electron',
  automation: 'puppeteer',
  parser: 'cheerio',
  database: 'lowdb',
};

export function getConfig(): AppConfig {
  const configStr = process.env.APP_CONFIG;
  if (configStr) {
    try {
      return { ...defaultConfig, ...JSON.parse(configStr) };
    } catch (error) {
      console.warn('Failed to parse APP_CONFIG, using defaults');
    }
  }
  return defaultConfig;
}

export function setConfig(config: Partial<AppConfig>): void {
  process.env.APP_CONFIG = JSON.stringify({ ...defaultConfig, ...config });
}
