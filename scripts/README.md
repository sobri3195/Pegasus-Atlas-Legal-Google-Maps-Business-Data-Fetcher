# Helper Scripts

This folder contains helper scripts to run Pegasus Atlas with different engine configurations.

## Linux/macOS Scripts

### Run with Playwright
```bash
./run-with-playwright.sh
```

### Run with Selenium
```bash
./run-with-selenium.sh
```

### Run with SQLite
```bash
./run-with-sqlite.sh
```

### Run with All Alternative Engines
```bash
./run-with-all-alternatives.sh
```

## Windows Scripts

### Run with Playwright
```cmd
run-with-playwright.bat
```

### Run with Selenium
```cmd
run-with-selenium.bat
```

### Run with SQLite
```cmd
run-with-sqlite.bat
```

### Run with All Alternative Engines
```cmd
run-with-all-alternatives.bat
```

## Custom Configuration

You can also set the configuration manually:

**Linux/macOS:**
```bash
export APP_CONFIG='{"automation":"playwright","parser":"cheerio","database":"sqlite"}'
npm run dev
```

**Windows:**
```cmd
set APP_CONFIG={"automation":"playwright","parser":"cheerio","database":"sqlite"}
npm run dev
```

## Available Options

- **automation**: `puppeteer` | `playwright` | `selenium`
- **parser**: `cheerio` | `dom-inspector`
- **database**: `lowdb` | `sqlite`
- **desktop**: `electron` | `tauri`

## Making Scripts Executable (Linux/macOS)

```bash
chmod +x *.sh
```
