import * as cheerio from 'cheerio';
import { IParserAdapter, ParsedElement } from './IParserAdapter';

export class CheerioAdapter implements IParserAdapter {
  private $: cheerio.CheerioAPI | null = null;

  load(html: string): void {
    this.$ = cheerio.load(html);
  }

  find(selector: string): ParsedElement[] {
    if (!this.$) {
      throw new Error('Parser not loaded');
    }

    const elements: ParsedElement[] = [];
    const $ = this.$;

    $(selector).each((_, element) => {
      const $el = $(element);
      const attributes: Record<string, string> = {};
      
      const attribs = (element as any).attribs || {};
      Object.keys(attribs).forEach(key => {
        attributes[key] = attribs[key];
      });

      elements.push({
        text: $el.text().trim(),
        attributes,
        html: $el.html() || undefined,
      });
    });

    return elements;
  }

  findFirst(selector: string): ParsedElement | null {
    const elements = this.find(selector);
    return elements.length > 0 ? elements[0] : null;
  }

  getText(selector: string): string {
    if (!this.$) {
      throw new Error('Parser not loaded');
    }
    return this.$(selector).first().text().trim();
  }

  getAttribute(selector: string, attribute: string): string | undefined {
    if (!this.$) {
      throw new Error('Parser not loaded');
    }
    return this.$(selector).first().attr(attribute);
  }
}
