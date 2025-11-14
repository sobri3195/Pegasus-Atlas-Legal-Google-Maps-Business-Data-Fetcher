# Quick Start Guide

This guide will help you get started with Pegasus Atlas quickly.

## Installation

```bash
# Clone the repository
git clone https://github.com/sobri3195/pegasus-atlas.git
cd pegasus-atlas

# Install dependencies
npm install
```

## Running with Different Engines

### Default Configuration (Puppeteer + Cheerio + LowDB)

```bash
npm run dev
```

### Using Playwright

**Linux/macOS:**
```bash
./scripts/run-with-playwright.sh
```

**Windows:**
```bash
scripts\run-with-playwright.bat
```

**Or manually:**
```bash
export APP_CONFIG='{"automation":"playwright","parser":"cheerio","database":"lowdb"}'
npm run dev
```

### Using Selenium

**Linux/macOS:**
```bash
./scripts/run-with-selenium.sh
```

**Windows:**
```bash
scripts\run-with-selenium.bat
```

### Using SQLite Database

**Linux/macOS:**
```bash
./scripts/run-with-sqlite.sh
```

**Windows:**
```bash
scripts\run-with-sqlite.bat
```

### Using All Alternative Engines

**Linux/macOS:**
```bash
./scripts/run-with-all-alternatives.sh
```

**Windows:**
```bash
scripts\run-with-all-alternatives.bat
```

## First Search

1. Launch the application
2. Enter a keyword in the search field (e.g., "coffee shops")
3. Configure options:
   - **Headless Mode**: Run browser in background
   - **Max Results**: Maximum number of results to collect
   - **Delay**: Wait time between actions (ms)
   - **Human Behavior**: Simulate human-like browsing
4. Click "Start Search"
5. View results in the table below

## Batch Search

1. Click on "Batch Search" tab
2. Enter multiple keywords (one per line):
   ```
   coffee shops
   restaurants
   hotels
   ```
3. Configure batch options
4. Click "Start Batch Search"
5. Monitor progress in real-time

## Export Data

1. Go to "Export" tab
2. Select format:
   - CSV - Simple comma-separated values
   - Excel - Formatted spreadsheet with headers
   - JSON - Structured data format
   - PDF - Summary report
3. Click "Export"
4. File will be saved to your Downloads folder

## Clean Data

Remove duplicates and normalize data:

1. Click "Clean Data" button
2. System will:
   - Remove duplicate entries
   - Normalize addresses
   - Format phone numbers
   - Consolidate similar records
3. View cleaned results

## Configuration Options

Create a `config.json` file in the project root:

```json
{
  "desktop": "electron",
  "automation": "puppeteer",
  "parser": "cheerio",
  "database": "lowdb"
}
```

Available options:
- **desktop**: `electron` | `tauri`
- **automation**: `puppeteer` | `playwright` | `selenium`
- **parser**: `cheerio` | `dom-inspector`
- **database**: `lowdb` | `sqlite`

## Troubleshooting

### Playwright Not Working

Install browsers:
```bash
npx playwright install
```

### Selenium WebDriver Issues

Install ChromeDriver:
```bash
npm install -g chromedriver
```

Or download from: https://chromedriver.chromium.org/

### SQLite Build Errors (Windows)

Install build tools:
```bash
npm install --global windows-build-tools
```

### Memory Issues

Use SQLite for large datasets:
```bash
export APP_CONFIG='{"database":"sqlite"}'
npm run dev
```

### Browser Automation Blocked

Enable human behavior simulation:
1. Check "Human Behavior" option
2. Increase delay to 2000-3000ms
3. Disable headless mode for debugging

## Performance Tips

### For Speed
- Use Puppeteer automation
- Use Cheerio parser
- Use LowDB for small datasets (<10k records)
- Enable headless mode
- Reduce delay times

### For Reliability
- Use Playwright automation
- Use DOM Inspector parser
- Use SQLite for large datasets
- Enable human behavior simulation
- Increase delay times

### For Large Datasets
- Use SQLite database
- Process in smaller batches
- Enable data cleaning periodically
- Export data regularly

## Next Steps

- Read [CONFIGURATION.md](CONFIGURATION.md) for advanced configuration
- Check [TAURI_MIGRATION.md](TAURI_MIGRATION.md) for Tauri setup
- Review [README.md](../README.md) for complete documentation
- Join community for support

## Support

- GitHub Issues: [Report a bug](https://github.com/sobri3195/pegasus-atlas/issues)
- Telegram: [@winlin_exploit](https://t.me/winlin_exploit)
- WhatsApp: [Community Group](https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl)

## Legal Notice

⚠️ **Important**: Only collect publicly available data. Respect website terms of service and robots.txt. Use for research and legitimate purposes only.
