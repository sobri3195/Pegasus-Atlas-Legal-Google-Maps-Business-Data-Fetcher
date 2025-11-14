export interface ParsedElement {
  text: string;
  attributes: Record<string, string>;
  html?: string;
}

export interface IParserAdapter {
  load(html: string): void;
  find(selector: string): ParsedElement[];
  findFirst(selector: string): ParsedElement | null;
  getText(selector: string): string;
  getAttribute(selector: string, attribute: string): string | undefined;
}
