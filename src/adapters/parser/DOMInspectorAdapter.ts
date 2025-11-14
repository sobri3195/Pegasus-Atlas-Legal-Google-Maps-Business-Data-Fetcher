import { JSDOM } from 'jsdom';
import { IParserAdapter, ParsedElement } from './IParserAdapter';

export class DOMInspectorAdapter implements IParserAdapter {
  private dom: JSDOM | null = null;
  private document: Document | null = null;

  load(html: string): void {
    this.dom = new JSDOM(html);
    this.document = this.dom.window.document;
  }

  find(selector: string): ParsedElement[] {
    if (!this.document) {
      throw new Error('Parser not loaded');
    }

    const elements: ParsedElement[] = [];
    const nodeList = this.document.querySelectorAll(selector);

    nodeList.forEach((element) => {
      const attributes: Record<string, string> = {};
      
      if (element instanceof Element) {
        Array.from(element.attributes).forEach(attr => {
          attributes[attr.name] = attr.value;
        });

        elements.push({
          text: element.textContent?.trim() || '',
          attributes,
          html: element.innerHTML,
        });
      }
    });

    return elements;
  }

  findFirst(selector: string): ParsedElement | null {
    const elements = this.find(selector);
    return elements.length > 0 ? elements[0] : null;
  }

  getText(selector: string): string {
    if (!this.document) {
      throw new Error('Parser not loaded');
    }
    const element = this.document.querySelector(selector);
    return element?.textContent?.trim() || '';
  }

  getAttribute(selector: string, attribute: string): string | undefined {
    if (!this.document) {
      throw new Error('Parser not loaded');
    }
    const element = this.document.querySelector(selector);
    return element?.getAttribute(attribute) || undefined;
  }
}
