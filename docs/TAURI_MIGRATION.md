# Migrating from Electron to Tauri

This guide will help you migrate Pegasus Atlas from Electron to Tauri.

## Why Tauri?

- **Smaller Bundle Size**: 3-10MB vs 50-100MB (Electron)
- **Lower Memory Usage**: Uses native WebView instead of bundling Chromium
- **Better Security**: Rust backend with strong type safety
- **Native Performance**: Direct OS integration
- **Cross-platform**: Windows, macOS, Linux

## Prerequisites

1. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Install Tauri CLI:
```bash
npm install -D @tauri-apps/cli
npm install @tauri-apps/api
```

## Step-by-Step Migration

### 1. Initialize Tauri

```bash
npm run tauri init
```

Answer the prompts:
- App name: `pegasus-atlas`
- Window title: `Pegasus Atlas`
- Web assets location: `dist/renderer`
- Dev server URL: `http://localhost:5173`
- Before dev command: `npm run dev:renderer`
- Before build command: `npm run build:renderer`

### 2. Update Project Structure

After initialization, you'll have:
```
src-tauri/
├── src/
│   └── main.rs       # Rust backend
├── icons/            # App icons
├── Cargo.toml        # Rust dependencies
└── tauri.conf.json   # Tauri configuration
```

### 3. Create Tauri Backend

Replace `src-tauri/src/main.rs` with:

```rust
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct SearchOptions {
    headless: Option<bool>,
    max_results: Option<u32>,
    delay: Option<u32>,
    human_behavior: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ApiResponse<T> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
}

#[tauri::command]
async fn start_search(keyword: String, options: SearchOptions) -> ApiResponse<Vec<serde_json::Value>> {
    // TODO: Implement automation logic
    ApiResponse {
        success: true,
        data: Some(vec![]),
        error: None,
    }
}

#[tauri::command]
async fn get_results() -> ApiResponse<Vec<serde_json::Value>> {
    // TODO: Implement database retrieval
    ApiResponse {
        success: true,
        data: Some(vec![]),
        error: None,
    }
}

#[tauri::command]
async fn clean_data() -> ApiResponse<Vec<serde_json::Value>> {
    // TODO: Implement data cleaning
    ApiResponse {
        success: true,
        data: Some(vec![]),
        error: None,
    }
}

#[tauri::command]
async fn export_data(format: String, data: Vec<serde_json::Value>) -> ApiResponse<String> {
    // TODO: Implement export
    ApiResponse {
        success: true,
        data: Some("exported.csv".to_string()),
        error: None,
    }
}

#[tauri::command]
async fn clear_database() -> ApiResponse<()> {
    // TODO: Implement database clearing
    ApiResponse {
        success: true,
        data: Some(()),
        error: None,
    }
}

#[tauri::command]
async fn get_config() -> ApiResponse<serde_json::Value> {
    // TODO: Get current config
    let config = serde_json::json!({
        "desktop": "tauri",
        "automation": "puppeteer",
        "parser": "cheerio",
        "database": "sqlite"
    });
    
    ApiResponse {
        success: true,
        data: Some(config),
        error: None,
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_search,
            get_results,
            clean_data,
            export_data,
            clear_database,
            get_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 4. Update Frontend IPC Calls

Create `src/tauri/preload.ts`:

```typescript
import { invoke } from '@tauri-apps/api/tauri';

export const tauriAPI = {
  startSearch: (keyword: string, options: any) => 
    invoke('start_search', { keyword, options }),
  
  batchSearch: (keywords: string[], options: any) => 
    invoke('batch_search', { keywords, options }),
  
  getResults: () => 
    invoke('get_results'),
  
  cleanData: () => 
    invoke('clean_data'),
  
  exportData: (format: string, data: any[]) => 
    invoke('export_data', { format, data }),
  
  clearDatabase: () => 
    invoke('clear_database'),
  
  getConfig: () =>
    invoke('get_config'),
};
```

### 5. Create Adapter Bridge

Create `src/adapters/desktop/ITauriAdapter.ts` to bridge between Electron and Tauri APIs.

### 6. Update package.json

Add Tauri scripts:

```json
{
  "scripts": {
    "tauri": "tauri",
    "dev:tauri": "tauri dev",
    "build:tauri": "tauri build"
  }
}
```

### 7. Run with Tauri

```bash
# Development
npm run dev:tauri

# Build
npm run build:tauri
```

## Key Differences

### IPC Communication

**Electron:**
```typescript
ipcRenderer.invoke('start-search', keyword, options)
```

**Tauri:**
```typescript
invoke('start_search', { keyword, options })
```

### File System Access

**Electron:**
```typescript
import { app } from 'electron';
const userDataPath = app.getPath('userData');
```

**Tauri:**
```rust
use tauri::api::path;
let app_dir = path::app_data_dir(&config).unwrap();
```

### Database Location

**Electron:**
- Uses Node.js `path` module
- Stored in `app.getPath('userData')`

**Tauri:**
- Uses Rust `std::path`
- Stored in platform-specific app data directory

## Automation in Tauri

For browser automation in Tauri, you have several options:

1. **Use Rust automation libraries:**
   - `headless_chrome` - Rust wrapper for Chrome DevTools Protocol
   - `fantoccini` - Rust WebDriver client (Selenium)
   - `playwright-rust` - Rust bindings for Playwright

2. **Keep Node.js automation (Hybrid approach):**
   - Run Node.js automation server separately
   - Communicate via IPC or HTTP
   - Tauri frontend calls Node backend

3. **Use system commands:**
   - Call Node.js scripts from Rust using `std::process::Command`
   - Example: `Command::new("node").args(["automation.js"]).output()`

## Recommended Hybrid Approach

For Pegasus Atlas, the hybrid approach works best:

1. Keep existing Node.js automation adapters
2. Create Rust backend that spawns Node.js processes
3. Use Tauri for UI and system integration
4. Communicate via JSON over stdio

Example in `main.rs`:

```rust
use std::process::Command;

#[tauri::command]
async fn start_search(keyword: String) -> ApiResponse<Vec<serde_json::Value>> {
    let output = Command::new("node")
        .args(&["automation-worker.js", &keyword])
        .output()
        .expect("Failed to execute automation");
    
    let results: Vec<serde_json::Value> = 
        serde_json::from_slice(&output.stdout).unwrap();
    
    ApiResponse {
        success: true,
        data: Some(results),
        error: None,
    }
}
```

## Database in Tauri

### SQLite with Tauri

Add to `Cargo.toml`:
```toml
[dependencies]
rusqlite = { version = "0.30", features = ["bundled"] }
```

Use in `main.rs`:
```rust
use rusqlite::{Connection, Result};

fn init_database() -> Result<Connection> {
    let conn = Connection::open("pegasus_atlas.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS results (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT,
            phone TEXT
        )",
        [],
    )?;
    Ok(conn)
}
```

## Configuration

Set Tauri as desktop framework:

```bash
export APP_CONFIG='{"desktop":"tauri","automation":"puppeteer","database":"sqlite"}'
npm run dev:tauri
```

## Performance Comparison

| Metric | Electron | Tauri |
|--------|----------|-------|
| Bundle Size | ~50-100MB | ~3-10MB |
| Memory Usage | ~100-200MB | ~30-80MB |
| Startup Time | ~2-3s | ~0.5-1s |
| CPU Usage | Higher | Lower |

## Limitations

1. No Node.js integration in frontend (security feature)
2. Must use Rust for backend logic
3. Different IPC mechanism
4. Requires Rust knowledge for advanced features

## Next Steps

1. Test Tauri build with current adapters
2. Implement Rust automation bridges
3. Benchmark performance differences
4. Create automated migration script

## Support

For issues with Tauri migration, open an issue on GitHub or consult:
- [Tauri Documentation](https://tauri.app/v1/guides/)
- [Tauri Discord](https://discord.com/invite/tauri)
