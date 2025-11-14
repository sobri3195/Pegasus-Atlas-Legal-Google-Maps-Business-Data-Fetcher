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

## Future Releases

See [README.md](README.md) roadmap section for planned features.
