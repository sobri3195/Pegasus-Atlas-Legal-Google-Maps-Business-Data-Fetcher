export interface SearchOptions {
  headless?: boolean;
  maxResults?: number;
  delay?: number;
  humanBehavior?: boolean;
}

export interface PageContent {
  html: string;
  url: string;
}

export interface IAutomationAdapter {
  initialize(options?: SearchOptions): Promise<void>;
  navigateTo(url: string): Promise<void>;
  getPageContent(): Promise<PageContent>;
  simulateHumanBehavior(): Promise<void>;
  setUserAgent(userAgent: string): Promise<void>;
  cleanup(): Promise<void>;
}
