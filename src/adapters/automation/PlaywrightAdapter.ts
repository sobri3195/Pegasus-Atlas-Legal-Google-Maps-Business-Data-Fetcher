import { Browser, Page, chromium } from 'playwright';
import { IAutomationAdapter, SearchOptions, PageContent } from './IAutomationAdapter';
import { randomDelay } from '../../utils/helpers';

export class PlaywrightAdapter implements IAutomationAdapter {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(options: SearchOptions = {}): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: options.headless !== false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });
    }

    if (!this.page) {
      const context = await this.browser.newContext();
      this.page = await context.newPage();
    }
  }

  async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }
    await this.page.goto(url, { waitUntil: 'networkidle' });
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
    await this.page.setExtraHTTPHeaders({
      'User-Agent': userAgent,
    });
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
