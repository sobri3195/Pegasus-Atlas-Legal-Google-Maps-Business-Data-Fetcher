import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { delay, randomDelay } from '../utils/helpers';

export interface SearchOptions {
  headless?: boolean;
  maxResults?: number;
  delay?: number;
  humanBehavior?: boolean;
}

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
  private browser: Browser | null = null;

  async initialize(options: SearchOptions = {}) {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: options.headless !== false ? 'new' : false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      });
    }
  }

  async search(keyword: string, options: SearchOptions = {}): Promise<BusinessData[]> {
    await this.initialize(options);

    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage();
    
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    try {
      const results: BusinessData[] = [];
      
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
      
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      
      if (options.humanBehavior) {
        await this.simulateHumanBehavior(page);
      }
      
      if (options.delay) {
        await delay(options.delay);
      }

      const content = await page.content();
      const $ = cheerio.load(content);
      
      const extractedData = await this.extractBusinessData($, keyword);
      results.push(...extractedData);

      await page.close();
      
      return results.slice(0, options.maxResults || 50);
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  private async extractBusinessData($: cheerio.CheerioAPI, keyword: string): Promise<BusinessData[]> {
    const results: BusinessData[] = [];
    
    $('div[data-attrid], div.g, div[jscontroller]').each((index, element) => {
      const $el = $(element);
      
      const name = $el.find('h3, h2, [role="heading"]').first().text().trim();
      const address = $el.find('[data-attrid*="address"], .address, [aria-label*="Address"]').first().text().trim();
      const phone = $el.find('[data-attrid*="phone"], .phone, a[href^="tel:"]').first().text().trim();
      const websiteLink = $el.find('a[href^="http"]').first().attr('href');
      
      if (name && name.length > 0) {
        const businessData: BusinessData = {
          id: `${Date.now()}-${index}`,
          name,
          address: address || undefined,
          phone: phone || undefined,
          website: websiteLink || undefined,
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

  private async simulateHumanBehavior(page: Page) {
    await randomDelay(500, 1500);
    
    await page.mouse.move(
      Math.random() * 300 + 100,
      Math.random() * 300 + 100
    );
    
    await randomDelay(200, 800);
    
    await page.evaluate(() => {
      window.scrollBy(0, Math.random() * 300 + 100);
    });
    
    await randomDelay(300, 1000);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
