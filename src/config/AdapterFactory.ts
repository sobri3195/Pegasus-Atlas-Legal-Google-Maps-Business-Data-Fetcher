import { IAutomationAdapter } from '../adapters/automation/IAutomationAdapter';
import { PuppeteerAdapter } from '../adapters/automation/PuppeteerAdapter';
import { PlaywrightAdapter } from '../adapters/automation/PlaywrightAdapter';
import { SeleniumAdapter } from '../adapters/automation/SeleniumAdapter';

import { IParserAdapter } from '../adapters/parser/IParserAdapter';
import { CheerioAdapter } from '../adapters/parser/CheerioAdapter';
import { DOMInspectorAdapter } from '../adapters/parser/DOMInspectorAdapter';

import { IDatabaseAdapter } from '../adapters/database/IDatabaseAdapter';
import { LowDBAdapter } from '../adapters/database/LowDBAdapter';
import { SQLiteAdapter } from '../adapters/database/SQLiteAdapter';

import { AutomationEngine, ParserEngine, DatabaseEngine } from './AppConfig';

export class AdapterFactory {
  static createAutomationAdapter(engine: AutomationEngine): IAutomationAdapter {
    switch (engine) {
      case 'puppeteer':
        return new PuppeteerAdapter();
      case 'playwright':
        return new PlaywrightAdapter();
      case 'selenium':
        return new SeleniumAdapter();
      default:
        throw new Error(`Unknown automation engine: ${engine}`);
    }
  }

  static createParserAdapter(engine: ParserEngine): IParserAdapter {
    switch (engine) {
      case 'cheerio':
        return new CheerioAdapter();
      case 'dom-inspector':
        return new DOMInspectorAdapter();
      default:
        throw new Error(`Unknown parser engine: ${engine}`);
    }
  }

  static createDatabaseAdapter(engine: DatabaseEngine): IDatabaseAdapter {
    switch (engine) {
      case 'lowdb':
        return new LowDBAdapter();
      case 'sqlite':
        return new SQLiteAdapter();
      default:
        throw new Error(`Unknown database engine: ${engine}`);
    }
  }
}
