# Pegasus Atlas - Architecture

## Overview

Pegasus Atlas is built using Electron, which allows us to create a cross-platform desktop application using web technologies.

## Technology Stack

### Core
- **Electron**: Desktop application framework
- **TypeScript**: Type-safe JavaScript
- **React**: UI framework
- **Vite**: Build tool and dev server

### Automation
- **Puppeteer**: Browser automation
- **Cheerio**: HTML parsing and DOM manipulation

### Data
- **LowDB**: Lightweight JSON database
- **ExcelJS**: Excel file generation
- **jsPDF**: PDF generation

## Architecture Layers

```
┌─────────────────────────────────────┐
│         Renderer Process            │
│    (React UI Components)            │
│  ┌──────────┐  ┌────────────────┐  │
│  │   App    │  │  Components    │  │
│  └──────────┘  └────────────────┘  │
└──────────────┬──────────────────────┘
               │ IPC
               │
┌──────────────▼──────────────────────┐
│          Main Process               │
│  ┌────────────────────────────┐    │
│  │    Electron Main           │    │
│  └────────────────────────────┘    │
│  ┌──────────┐  ┌──────────────┐    │
│  │Automation│  │     Data      │    │
│  │  Engine  │  │   Manager     │    │
│  └──────────┘  └──────────────┘    │
│  ┌──────────┐                       │
│  │  Export  │                       │
│  │ Service  │                       │
│  └──────────┘                       │
└─────────────────────────────────────┘
```

## Directory Structure

```
pegasus-atlas/
├── src/
│   ├── main/              # Main process (Node.js)
│   │   ├── index.ts       # Entry point
│   │   └── preload.ts     # IPC bridge
│   │
│   ├── renderer/          # Renderer process (Browser)
│   │   ├── main.tsx       # React entry
│   │   ├── App.tsx        # Main component
│   │   ├── styles.css     # Global styles
│   │   └── components/    # UI components
│   │       ├── SearchForm.tsx
│   │       ├── ResultsTable.tsx
│   │       ├── ExportPanel.tsx
│   │       └── StatsPanel.tsx
│   │
│   ├── automation/        # Browser automation
│   │   └── engine.ts      # Puppeteer logic
│   │
│   ├── data/              # Data management
│   │   ├── manager.ts     # Database operations
│   │   └── export.ts      # Export functionality
│   │
│   └── utils/             # Utilities
│       └── helpers.ts     # Helper functions
│
├── docs/                  # Documentation
│   ├── USER_GUIDE.md
│   ├── API.md
│   └── ARCHITECTURE.md
│
├── dist/                  # Build output
│   ├── main/
│   └── renderer/
│
└── [config files]
```

## Component Flow

### Search Flow

1. User enters keyword in `SearchForm`
2. `SearchForm` calls `window.electronAPI.startSearch()`
3. IPC message sent to main process
4. Main process handler calls `AutomationEngine.search()`
5. Puppeteer launches browser and performs search
6. Results parsed with Cheerio
7. `DataManager` saves results to LowDB
8. Response sent back to renderer
9. UI updates with new results

### Batch Search Flow

1. User enters multiple keywords
2. `SearchForm` calls `window.electronAPI.batchSearch()`
3. Main process iterates through keywords
4. Progress events sent to renderer for each keyword
5. All results collected and saved
6. Final response sent to renderer

### Export Flow

1. User clicks export button
2. `ExportPanel` calls `window.electronAPI.exportData()`
3. Main process handler calls `ExportService.export()`
4. Data formatted based on selected format
5. File written to downloads folder
6. File path returned to renderer

## Security Model

### Context Isolation
- Renderer process isolated from Node.js
- IPC communication through preload script
- No direct Node.js access from renderer

### Process Separation
- Main process: Full Node.js access
- Renderer process: Browser environment
- Preload script: Controlled bridge

## Data Flow

```
User Input → React Component → IPC → Main Process
                                        ↓
                                  Automation Engine
                                        ↓
                                  Puppeteer/Cheerio
                                        ↓
                                  Data Extraction
                                        ↓
                                   Data Manager
                                        ↓
                                      LowDB
                                        ↓
                                  ← Response ←
```

## State Management

- React component state for UI
- LowDB for persistent data
- No global state management (Redux, MobX) needed
- IPC for cross-process communication

## Browser Automation Strategy

### Puppeteer Configuration
- Headless mode for performance
- Visible mode for debugging
- Custom user agent
- Controlled navigation

### Human Behavior Simulation
- Random delays
- Mouse movements
- Scroll actions
- Natural timing

### Error Handling
- Retry logic for failed requests
- Timeout handling
- Graceful degradation

## Database Schema

### LowDB Structure
```json
{
  "results": [
    {
      "id": "unique-id",
      "name": "Business Name",
      "address": "Address",
      "phone": "Phone",
      "website": "URL",
      "category": "Category",
      "coordinates": { "lat": 0, "lng": 0 },
      "metadata": {},
      "timestamp": 1234567890
    }
  ]
}
```

## Build Process

### Development
1. `npm run dev:main` - Compile main process
2. `npm run dev:renderer` - Start Vite dev server
3. Main process loads from localhost:5173

### Production
1. `npm run build:main` - Compile TypeScript
2. `npm run build:renderer` - Build React app
3. Output to `dist/` folder
4. Package with electron-builder

## Performance Considerations

### Memory Management
- Close pages after use
- Cleanup browser instances
- Limit concurrent operations

### Database Optimization
- Regular cleanup
- Indexing for large datasets
- Batch operations

### UI Responsiveness
- Async operations
- Progress indicators
- Background processing

## Extensibility

### Adding New Features
1. Create module in appropriate folder
2. Expose through IPC if needed
3. Add UI components
4. Update documentation

### Plugin System (Future)
- Module-based architecture
- Event hooks
- Custom extractors
- Template system

## Testing Strategy

### Unit Tests
- Utility functions
- Data processing
- Parsing logic

### Integration Tests
- IPC communication
- Database operations
- Export functionality

### E2E Tests
- Full application flow
- User interactions
- Real browser automation

## Deployment

### Packaging
- electron-builder for packaging
- Platform-specific builds
- Auto-update support

### Distribution
- GitHub Releases
- Direct download
- Package managers (future)

## Monitoring & Logging

### Logging Strategy
- Console logs for development
- File logs for production
- Error tracking
- Performance metrics

### User Analytics
- No tracking by default
- Opt-in analytics
- Privacy-focused

## Security Considerations

### Data Security
- Local storage only
- No external transmission
- User-controlled data

### Browser Security
- Sandboxed automation
- No arbitrary code execution
- Controlled navigation

### Update Security
- Signed updates
- Checksum verification
- Secure channels

## Future Enhancements

1. Visual flow builder
2. Proxy rotation
3. DOM selector recorder
4. Template extraction
5. Plugin marketplace
6. Cloud sync (optional)
7. Collaborative features
8. Advanced scheduling
