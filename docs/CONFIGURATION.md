# Configuration Guide

Pegasus Atlas now supports multiple engines for automation, parsing, and database operations. You can configure which engines to use through environment variables or programmatically.

## Supported Engines

### Desktop Framework
- **electron** (default) - Cross-platform desktop app framework
- **tauri** - Lightweight alternative using Rust and WebView

### Automation Engine
- **puppeteer** (default) - Headless Chrome automation
- **playwright** - Multi-browser automation (Chrome, Firefox, Safari)
- **selenium** - Traditional WebDriver-based automation

### Parser Engine
- **cheerio** (default) - Fast, jQuery-like HTML parser
- **dom-inspector** - Native DOM parsing using JSDOM

### Database Engine
- **lowdb** (default) - Simple JSON file-based database
- **sqlite** - SQLite relational database

## Configuration Methods

### 1. Environment Variables

Set the `APP_CONFIG` environment variable with a JSON configuration:

```bash
# Linux/macOS
export APP_CONFIG='{"automation":"playwright","parser":"cheerio","database":"sqlite"}'

# Windows
set APP_CONFIG={"automation":"playwright","parser":"cheerio","database":"sqlite"}
```

### 2. Configuration File

Create a `config.json` file in your project root:

```json
{
  "desktop": "electron",
  "automation": "puppeteer",
  "parser": "cheerio",
  "database": "lowdb"
}
```

Then load it in your code:

```typescript
import { setConfig } from './config/AppConfig';
import config from './config.json';

setConfig(config);
```

## Engine Comparison

### Automation Engines

| Feature | Puppeteer | Playwright | Selenium |
|---------|-----------|------------|----------|
| Speed | Fast | Fast | Moderate |
| Multi-browser | Chrome only | Chrome, Firefox, Safari | All browsers |
| Modern API | ✓ | ✓ | Traditional |
| Network interception | ✓ | ✓ | Limited |
| Recommended for | Single browser | Multi-browser | Legacy support |

### Parser Engines

| Feature | Cheerio | DOM Inspector |
|---------|---------|---------------|
| Speed | Very Fast | Fast |
| Memory | Low | Moderate |
| DOM API | jQuery-like | Native DOM |
| Recommended for | Simple parsing | Complex DOM manipulation |

### Database Engines

| Feature | LowDB | SQLite |
|---------|-------|--------|
| Setup | Zero config | Minimal |
| Performance | Good for <10k records | Good for millions |
| Query language | JavaScript | SQL |
| File format | JSON | Binary |
| Recommended for | Small datasets | Large datasets |

## Examples

### Use Playwright with SQLite

```bash
export APP_CONFIG='{"automation":"playwright","database":"sqlite"}'
npm start
```

### Use Selenium with DOM Inspector

```bash
export APP_CONFIG='{"automation":"selenium","parser":"dom-inspector"}'
npm start
```

### Use all alternative engines

```bash
export APP_CONFIG='{"automation":"playwright","parser":"dom-inspector","database":"sqlite"}'
npm start
```

## Desktop Framework Migration

### Migrating to Tauri

Tauri is a lightweight alternative to Electron that uses native WebView and Rust backend.

**Benefits:**
- Smaller bundle size (3-10MB vs 50-100MB)
- Lower memory usage
- Better security
- Native performance

**Steps to migrate:**

1. Install Tauri CLI:
```bash
npm install -g @tauri-apps/cli
```

2. Initialize Tauri in your project:
```bash
npm install @tauri-apps/api
tauri init
```

3. Update configuration:
```typescript
setConfig({ desktop: 'tauri' });
```

4. Adapt IPC communication from Electron to Tauri:
   - Replace `ipcRenderer.invoke()` with `invoke()` from `@tauri-apps/api/tauri`
   - Update backend handlers in `src-tauri/src/main.rs`

5. Build:
```bash
tauri build
```

**Note:** The adapter architecture in this project makes it easy to switch between Electron and Tauri with minimal code changes.

## Default Configuration

If no configuration is provided, the following defaults are used:

```json
{
  "desktop": "electron",
  "automation": "puppeteer",
  "parser": "cheerio",
  "database": "lowdb"
}
```

## Troubleshooting

### Playwright Installation Issues

```bash
npx playwright install
```

### Selenium WebDriver Issues

Make sure you have ChromeDriver installed:
```bash
npm install -g chromedriver
```

### SQLite Issues on Windows

You may need to install Visual Studio Build Tools:
```bash
npm install --global windows-build-tools
```

## Performance Tips

1. **For speed**: Use Puppeteer + Cheerio + LowDB
2. **For reliability**: Use Playwright + DOM Inspector + SQLite
3. **For large datasets**: Use any automation + any parser + SQLite
4. **For cross-browser**: Use Playwright or Selenium
