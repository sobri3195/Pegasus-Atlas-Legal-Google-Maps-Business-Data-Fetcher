import puppeteer, { Browser, Page } from 'puppeteer';
import { IAutomationAdapter, SearchOptions, PageContent } from './IAutomationAdapter';
import { delay, randomDelay } from '../../utils/helpers';

export class PuppeteerAdapter implements IAutomationAdapter {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(options: SearchOptions = {}): Promise<void> {
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

    if (!this.page) {
      this.page = await this.browser.newPage();
    }
  }

  async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    await this.page.goto(url, { waitUntil: 'networkidle2' });
  }

  async getPageContent(): Promise<PageContent> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    const html = await this.page.content();
    const url = this.page.url();
    return { html, url };
  }

  async simulateHumanBehavior(): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    await randomDelay(500, 1500);

    await this.page.mouse.move(
      Math.random() * 300 + 100,
      Math.random() * 300 + 100
    );

    await randomDelay(200, 800);

    await this.page.evaluate(() => {
      window.scrollBy(0, Math.random() * 300 + 100);
    });

    await randomDelay(300, 1000);
  }

  async setUserAgent(userAgent: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    await this.page.setUserAgent(userAgent);
  }

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
