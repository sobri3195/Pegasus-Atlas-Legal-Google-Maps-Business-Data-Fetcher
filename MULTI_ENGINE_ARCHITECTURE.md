# Multi-Engine Architecture

## Overview

Pegasus Atlas v2.0 introduces a flexible multi-engine architecture that allows you to choose between different automation, parsing, and database engines based on your needs.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Pegasus Atlas v2.0                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Configuration Layer                       │
│  • APP_CONFIG environment variable                          │
│  • config.json file                                         │
│  • Default configuration                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Adapter Factory                         │
│  • Creates automation adapters                              │
│  • Creates parser adapters                                  │
│  • Creates database adapters                                │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   Automation     │ │     Parser       │ │    Database      │
│    Adapters      │ │    Adapters      │ │    Adapters      │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ • Puppeteer      │ │ • Cheerio        │ │ • LowDB          │
│ • Playwright     │ │ • DOM Inspector  │ │ • SQLite         │
│ • Selenium       │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Core Components                          │
│  • AutomationEngine (uses automation + parser adapters)     │
│  • DataManager (uses database adapter)                      │
│  • ExportService                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                           │
│  • React-based UI                                           │
│  • IPC communication via preload                            │
│  • Real-time progress updates                               │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. Adapter Pattern

Each engine type (automation, parser, database) implements a common interface:

```typescript
// Example: Automation Adapter Interface
interface IAutomationAdapter {
  initialize(options?: SearchOptions): Promise<void>;
  navigateTo(url: string): Promise<void>;
  getPageContent(): Promise<PageContent>;
  simulateHumanBehavior(): Promise<void>;
  setUserAgent(userAgent: string): Promise<void>;
  cleanup(): Promise<void>;
}
```

**Benefits:**
- Loose coupling between components
- Easy to add new engines
- Interchangeable implementations
- Testability through mocking

### 2. Factory Pattern

`AdapterFactory` creates adapter instances based on configuration:

```typescript
class AdapterFactory {
  static createAutomationAdapter(engine: AutomationEngine): IAutomationAdapter
  static createParserAdapter(engine: ParserEngine): IParserAdapter
  static createDatabaseAdapter(engine: DatabaseEngine): IDatabaseAdapter
}
```

**Benefits:**
- Centralized object creation
- Configuration-driven instantiation
- Easy to extend with new types
- Single responsibility principle

### 3. Dependency Injection

Core components receive adapters through constructor injection:

```typescript
class AutomationEngine {
  constructor(
    private automationAdapter: IAutomationAdapter,
    private parserAdapter: IParserAdapter
  ) {}
}

class DataManager {
  constructor(private databaseAdapter: IDatabaseAdapter) {}
}
```

**Benefits:**
- Testability (can inject mocks)
- Flexibility (runtime configuration)
- Separation of concerns
- Inversion of control

## Component Details

### Automation Adapters

#### Puppeteer (Default)
- **Best for:** Speed, Chrome-only automation
- **Pros:** Fast, well-tested, good documentation
- **Cons:** Chrome/Chromium only
- **Use case:** Single-browser automation, production use

#### Playwright
- **Best for:** Multi-browser testing, modern APIs
- **Pros:** Multi-browser, modern API, good developer experience
- **Cons:** Larger dependency size
- **Use case:** Cross-browser testing, advanced automation

#### Selenium
- **Best for:** Legacy support, traditional WebDriver
- **Pros:** Mature, widely supported, traditional
- **Cons:** Slower, older API
- **Use case:** Legacy systems, strict WebDriver compliance

### Parser Adapters

#### Cheerio (Default)
- **Best for:** Speed, simple parsing
- **Pros:** Very fast, low memory, jQuery-like syntax
- **Cons:** Limited DOM manipulation
- **Use case:** Simple HTML parsing, large datasets

#### DOM Inspector (JSDOM)
- **Best for:** Complex DOM manipulation
- **Pros:** Full DOM API, browser-like environment
- **Cons:** Higher memory usage, slower
- **Use case:** Complex parsing, JavaScript evaluation

### Database Adapters

#### LowDB (Default)
- **Best for:** Small datasets, simplicity
- **Pros:** Zero config, human-readable JSON, simple API
- **Cons:** Not suitable for large datasets
- **Use case:** Development, small projects (<10k records)

#### SQLite
- **Best for:** Large datasets, production
- **Pros:** Fast, SQL queries, millions of records
- **Cons:** Binary format, requires SQL knowledge
- **Use case:** Production, large datasets, complex queries

## Implementation Guide

### Adding a New Automation Engine

1. Create adapter class implementing `IAutomationAdapter`:

```typescript
// src/adapters/automation/MyEngineAdapter.ts
import { IAutomationAdapter } from './IAutomationAdapter';

export class MyEngineAdapter implements IAutomationAdapter {
  async initialize(options?: SearchOptions): Promise<void> {
    // Implementation
  }
  
  async navigateTo(url: string): Promise<void> {
    // Implementation
  }
  
  // ... implement all interface methods
}
```

2. Add to factory:

```typescript
// src/config/AdapterFactory.ts
case 'my-engine':
  return new MyEngineAdapter();
```

3. Update configuration type:

```typescript
// src/config/AppConfig.ts
export type AutomationEngine = 'puppeteer' | 'playwright' | 'selenium' | 'my-engine';
```

### Adding a New Parser Engine

Follow same pattern for `IParserAdapter`.

### Adding a New Database Engine

Follow same pattern for `IDatabaseAdapter`.

## Configuration System

### Priority Order

1. `APP_CONFIG` environment variable (highest priority)
2. `config.json` file in project root
3. Default configuration (lowest priority)

### Environment Variable

```bash
export APP_CONFIG='{"automation":"playwright","parser":"cheerio","database":"sqlite"}'
```

### Configuration File

```json
{
  "desktop": "electron",
  "automation": "playwright",
  "parser": "cheerio",
  "database": "sqlite"
}
```

### Programmatic Configuration

```typescript
import { setConfig } from './config/AppConfig';

setConfig({
  automation: 'playwright',
  database: 'sqlite'
});
```

## Performance Characteristics

### Automation Engines

| Engine | Speed | Memory | Multi-Browser | Stability |
|--------|-------|--------|---------------|-----------|
| Puppeteer | ⚡⚡⚡ | 💾💾 | ❌ | ✅✅✅ |
| Playwright | ⚡⚡ | 💾💾💾 | ✅ | ✅✅ |
| Selenium | ⚡ | 💾💾💾 | ✅ | ✅✅ |

### Parser Engines

| Engine | Speed | Memory | API Style | DOM Support |
|--------|-------|--------|-----------|-------------|
| Cheerio | ⚡⚡⚡ | 💾 | jQuery | Limited |
| DOM Inspector | ⚡⚡ | 💾💾 | Native | Full |

### Database Engines

| Engine | Speed (Read) | Speed (Write) | Max Records | Query Language |
|--------|--------------|---------------|-------------|----------------|
| LowDB | ⚡⚡⚡ | ⚡⚡ | 10k | JavaScript |
| SQLite | ⚡⚡⚡ | ⚡⚡⚡ | Millions | SQL |

## Best Practices

### 1. Choose the Right Engine for Your Use Case

- **Development:** Default stack (Puppeteer + Cheerio + LowDB)
- **Production (small):** Puppeteer + Cheerio + LowDB
- **Production (large):** Playwright + Cheerio + SQLite
- **Cross-browser:** Playwright + any parser + any database
- **Legacy systems:** Selenium + Cheerio + SQLite

### 2. Configuration Management

- Use environment variables for different environments
- Keep `config.json` out of version control (use `config.example.json`)
- Document configuration in README

### 3. Testing

- Test with multiple engines
- Use dependency injection for unit testing
- Mock adapters in tests

### 4. Error Handling

- Adapters should handle their own errors
- Return consistent error formats
- Log errors at adapter level

### 5. Performance

- Profile with different engines
- Cache parser results when possible
- Use appropriate database for dataset size
- Enable headless mode in production

## Migration from v1.x

### Breaking Changes
None! v2.0 is 100% backward compatible.

### Migration Steps
1. Update dependencies: `npm install`
2. Keep using default configuration (no changes needed)
3. Optionally try different engines

### New Features
- Multi-engine support
- Configuration system
- Adapter pattern
- Factory pattern
- Better testability

## Future Roadmap

### v2.1.0
- Hot-swapping engines without restart
- Engine health monitoring
- Performance benchmarking tool
- Configuration UI

### v2.2.0
- Plugin system for custom adapters
- Adapter marketplace
- Advanced caching strategies

### v3.0.0
- Tauri implementation
- Python parser bridge (BeautifulSoup)
- Distributed automation
- Cloud database adapters

## Support

- **Documentation:** [CONFIGURATION.md](CONFIGURATION.md)
- **Quick Start:** [QUICK_START.md](QUICK_START.md)
- **Migration Guide:** [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)
- **Tauri Migration:** [TAURI_MIGRATION.md](TAURI_MIGRATION.md)
- **GitHub:** [Issues](https://github.com/sobri3195/pegasus-atlas/issues)
- **Telegram:** [@winlin_exploit](https://t.me/winlin_exploit)

---

**Built with 💙 using TypeScript and modern design patterns**
