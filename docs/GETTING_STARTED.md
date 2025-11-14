# Getting Started with Pegasus Atlas

## Quick Start Guide

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- At least 2GB of free disk space
- Internet connection for downloading dependencies

### Installation Steps

1. **Clone or Download the Repository**
   ```bash
   git clone <repository-url>
   cd pegasus-atlas
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   This will install all required packages including:
   - Electron
   - Puppeteer (with Chromium)
   - React and related UI libraries
   - Data processing libraries

3. **Run in Development Mode**
   ```bash
   npm run dev
   ```
   
   This starts:
   - Vite development server for the UI
   - Electron in development mode
   - Hot reload for quick development

### First Use

1. **Launch the Application**
   - The application window will open automatically
   - You'll see the main interface with search form on the left

2. **Try a Simple Search**
   - Enter a keyword like "restaurants in Jakarta"
   - Keep default settings for your first search
   - Click "Start Search"
   - Wait for results to appear

3. **View Results**
   - Results appear in the table on the right
   - Each result shows name, address, phone, website, etc.
   - Statistics are updated automatically

4. **Export Your Data**
   - Click any export button (CSV, Excel, JSON, or PDF)
   - File will be saved to your Downloads folder
   - A confirmation message shows the file path

### Development Workflow

#### File Structure
```
pegasus-atlas/
├── src/
│   ├── main/          # Backend (Electron main process)
│   ├── renderer/      # Frontend (React UI)
│   ├── automation/    # Browser automation logic
│   ├── data/          # Database and exports
│   └── utils/         # Helper functions
├── docs/              # Documentation
└── dist/              # Build output (generated)
```

#### Making Changes

**UI Changes:**
1. Edit files in `src/renderer/`
2. Changes hot-reload automatically
3. Check browser console for errors

**Backend Changes:**
1. Edit files in `src/main/`, `src/automation/`, or `src/data/`
2. Restart the application to see changes
3. Check terminal for errors

#### Building for Production

```bash
# Build the application
npm run build

# Run the built application
npm start
```

### Common Tasks

#### Add a New UI Component
1. Create file in `src/renderer/components/`
2. Import and use in `App.tsx`
3. Add styles in `styles.css`

#### Modify Search Logic
1. Edit `src/automation/engine.ts`
2. Update extraction logic in `extractBusinessData()`
3. Test with different keywords

#### Add Export Format
1. Edit `src/data/export.ts`
2. Add new export method
3. Update UI in `ExportPanel.tsx`

#### Customize Database Schema
1. Edit types in `src/automation/engine.ts`
2. Update `src/data/manager.ts`
3. Update UI components to display new fields

### Troubleshooting

#### Application Won't Start
- Check Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and run `npm install` again
- Check for port conflicts (Vite uses port 5173)

#### Puppeteer Issues
- Puppeteer downloads Chromium automatically
- If download fails, check internet connection
- Try: `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false npm install`

#### Build Errors
- Run `npm run lint` to check for code errors
- Ensure all TypeScript errors are resolved
- Check `tsconfig.json` settings

#### Search Not Working
- Check internet connection
- Try with visible browser mode (uncheck "Headless Mode")
- Increase delay if website is slow
- Check browser console for errors

### Testing

#### Manual Testing
1. Run `npm run dev`
2. Test each feature:
   - Single search
   - Batch search
   - Data cleaning
   - Each export format
   - Clear database

#### Automated Testing (Future)
```bash
# Unit tests (when implemented)
npm test

# E2E tests (when implemented)
npm run test:e2e
```

### Deployment

#### Package for Distribution
```bash
# Install electron-builder
npm install -g electron-builder

# Build for current platform
npm run build
electron-builder

# Build for specific platform
electron-builder --mac
electron-builder --windows
electron-builder --linux
```

Output will be in `release/` folder.

### Next Steps

1. **Read the Documentation**
   - [User Guide](USER_GUIDE.md) - For end users
   - [API Documentation](API.md) - For developers
   - [Architecture](ARCHITECTURE.md) - System design

2. **Explore the Code**
   - Start with `src/main/index.ts` - Application entry
   - Check `src/automation/engine.ts` - Core automation
   - Review `src/renderer/App.tsx` - Main UI

3. **Customize for Your Needs**
   - Modify search targets
   - Add custom data fields
   - Create custom export formats
   - Build automation templates

### Getting Help

- Check [Troubleshooting](#troubleshooting) section
- Review [Common Tasks](#common-tasks)
- Read documentation in `docs/` folder
- Check console logs for error messages
- Review code comments

### Contributing

Want to contribute? See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Legal & Ethics

Remember to:
- ✅ Use only for public data
- ✅ Respect website terms of service
- ✅ Implement reasonable delays
- ✅ Use for legitimate purposes

See [SECURITY.md](../SECURITY.md) for detailed guidelines.

---

**Happy Automating! 🚀**
