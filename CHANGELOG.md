# Changelog

All notable changes to Pegasus Atlas will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- Initial release of Pegasus Atlas
- Automated business search functionality
- Single keyword search
- Batch search with multiple keywords
- Headless and visible browser modes
- Human behavior simulation (random delays, mouse movements, scrolling)
- Data extraction from public web pages
  - Business name
  - Address
  - Phone number
  - Website
  - Category
  - Coordinates (when available)
- Data cleaning and deduplication
- Address normalization
- Phone number formatting
- Multiple export formats:
  - CSV export
  - Excel export with formatting
  - JSON export
  - PDF export (summary report)
- Real-time batch progress tracking
- Statistics dashboard
  - Total records
  - Records with phone
  - Records with website
  - Records with address
- Local database storage with LowDB
- Electron-based desktop application
- Cross-platform support (Windows, macOS, Linux)
- TypeScript implementation
- React-based user interface
- Comprehensive documentation
  - User Guide
  - API Documentation
  - Architecture Documentation
  - Security Guidelines
  - Contributing Guidelines

### Security
- Context isolation enabled
- Preload script for IPC security
- Local-only data storage
- No external data transmission
- Legal and ethical use disclaimers

### Documentation
- README with project overview
- USER_GUIDE for end users
- API documentation for developers
- ARCHITECTURE documentation
- SECURITY policy
- CONTRIBUTING guidelines
- LICENSE (MIT)

## [2.0.0] - 2024-11-14

### Added - Multi-Engine Architecture
- **Adapter Pattern Implementation**: Introduced abstraction layers for all core components
- **Multiple Automation Engines Support**:
  - Puppeteer (default) - Fast Chrome automation
  - Playwright - Multi-browser support (Chrome, Firefox, Safari)
  - Selenium - Traditional WebDriver-based automation
- **Multiple Parser Engines Support**:
  - Cheerio (default) - jQuery-like HTML parser
  - DOM Inspector - Native DOM parsing with JSDOM
- **Multiple Database Engines Support**:
  - LowDB (default) - JSON file-based database
  - SQLite - Full-featured SQL database
- **Desktop Framework Options**:
  - Electron (current)
  - Tauri (migration ready)

### Changed
- Refactored `AutomationEngine` to use adapter pattern
- Refactored `DataManager` to use database adapters
- Updated main process to use factory pattern for adapter creation
- Enhanced configuration system with environment variable support

### Added - Configuration
- `AppConfig` system for engine selection
- `AdapterFactory` for creating engine instances
- Environment variable configuration support (`APP_CONFIG`)
- Configuration file support (`config.json`)

### Added - Documentation
- `CONFIGURATION.md` - Comprehensive configuration guide
- `TAURI_MIGRATION.md` - Guide for migrating to Tauri
- Engine comparison tables
- Performance benchmarks
- Configuration examples

### Dependencies
- Added `playwright` ^1.40.1
- Added `selenium-webdriver` ^4.16.0
- Added `jsdom` ^23.0.1
- Added `sqlite` ^5.1.1
- Added `sqlite3` ^5.1.6

### Technical Improvements
- Abstraction through interfaces (`IAutomationAdapter`, `IParserAdapter`, `IDatabaseAdapter`)
- Factory pattern for adapter instantiation
- Improved separation of concerns
- Better testability through dependency injection
- Modular architecture for easy engine swapping

### Migration Notes
- Existing code remains backward compatible
- Default configuration uses original stack (Puppeteer + Cheerio + LowDB)
- No breaking changes for existing users
- New engines can be enabled via configuration

## Future Releases

See [README.md](README.md) roadmap section for planned features.
