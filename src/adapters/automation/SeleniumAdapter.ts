import { Builder, Browser, WebDriver, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { IAutomationAdapter, SearchOptions, PageContent } from './IAutomationAdapter';
import { randomDelay } from '../../utils/helpers';

export class SeleniumAdapter implements IAutomationAdapter {
  private driver: WebDriver | null = null;

  async initialize(options: SearchOptions = {}): Promise<void> {
    if (!this.driver) {
      const chromeOptions = new chrome.Options();
      
      if (options.headless !== false) {
        chromeOptions.addArguments('--headless');
      }
      
      chromeOptions.addArguments(
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      );

      this.driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(chromeOptions)
        .build();
    }
  }

  async navigateTo(url: string): Promise<void> {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }
    await this.driver.get(url);
    await this.driver.wait(() => {
      return this.driver!.executeScript('return document.readyState').then((state: any) => {
        return state === 'complete';
      });
    }, 30000);
  }

  async getPageContent(): Promise<PageContent> {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }
    const html = await this.driver.getPageSource();
    const url = await this.driver.getCurrentUrl();
    return { html, url };
  }

  async simulateHumanBehavior(): Promise<void> {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }

    await randomDelay(500, 1500);

    const actions = this.driver.actions({ async: true });
    await actions.move({ x: Math.floor(Math.random() * 300 + 100), y: Math.floor(Math.random() * 300 + 100) }).perform();

    await randomDelay(200, 800);

    await this.driver.executeScript('window.scrollBy(0, arguments[0]);', Math.floor(Math.random() * 300 + 100));

    await randomDelay(300, 1000);
  }

  async setUserAgent(userAgent: string): Promise<void> {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }
    await this.driver.executeScript(`Object.defineProperty(navigator, 'userAgent', {get: function(){return '${userAgent}';}});`);
  }

  async cleanup(): Promise<void> {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }
}
