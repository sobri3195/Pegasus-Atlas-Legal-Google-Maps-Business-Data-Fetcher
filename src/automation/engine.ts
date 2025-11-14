import { IAutomationAdapter, SearchOptions } from '../adapters/automation/IAutomationAdapter';
import { IParserAdapter } from '../adapters/parser/IParserAdapter';
import { delay } from '../utils/helpers';

export { SearchOptions } from '../adapters/automation/IAutomationAdapter';

export interface BusinessData {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  category?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  metadata?: Record<string, any>;
  timestamp: number;
}

export class AutomationEngine {
  private automationAdapter: IAutomationAdapter;
  private parserAdapter: IParserAdapter;

  constructor(automationAdapter: IAutomationAdapter, parserAdapter: IParserAdapter) {
    this.automationAdapter = automationAdapter;
    this.parserAdapter = parserAdapter;
  }

  async initialize(options: SearchOptions = {}) {
    await this.automationAdapter.initialize(options);
  }

  async search(keyword: string, options: SearchOptions = {}): Promise<BusinessData[]> {
    await this.initialize(options);

    await this.automationAdapter.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    try {
      const results: BusinessData[] = [];

      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;

      await this.automationAdapter.navigateTo(searchUrl);

      if (options.humanBehavior) {
        await this.automationAdapter.simulateHumanBehavior();
      }

      if (options.delay) {
        await delay(options.delay);
      }

      const pageContent = await this.automationAdapter.getPageContent();
      this.parserAdapter.load(pageContent.html);

      const extractedData = await this.extractBusinessData(keyword);
      results.push(...extractedData);

      return results.slice(0, options.maxResults || 50);
    } catch (error) {
      throw error;
    }
  }

  private async extractBusinessData(keyword: string): Promise<BusinessData[]> {
    const results: BusinessData[] = [];

    const elements = this.parserAdapter.find('div[data-attrid], div.g, div[jscontroller]');

    elements.forEach((element, index) => {
      const nameElements = this.parserAdapter.find('h3, h2, [role="heading"]');
      const name = nameElements.length > index ? nameElements[index].text : '';

      const addressElements = this.parserAdapter.find('[data-attrid*="address"], .address, [aria-label*="Address"]');
      const address = addressElements.length > index ? addressElements[index].text : '';

      const phoneElements = this.parserAdapter.find('[data-attrid*="phone"], .phone, a[href^="tel:"]');
      const phone = phoneElements.length > index ? phoneElements[index].text : '';

      const websiteElements = this.parserAdapter.find('a[href^="http"]');
      const website = websiteElements.length > index ? websiteElements[index].attributes.href : undefined;

      if (name && name.length > 0) {
        const businessData: BusinessData = {
          id: `${Date.now()}-${index}`,
          name,
          address: address || undefined,
          phone: phone || undefined,
          website: website || undefined,
          category: keyword,
          timestamp: Date.now(),
          metadata: {
            source: 'google-search',
            keyword,
          },
        };

        results.push(businessData);
      }
    });

    return results;
  }

  async cleanup() {
    await this.automationAdapter.cleanup();
  }
}
