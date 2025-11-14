import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { AutomationEngine } from '../automation/engine';
import { DataManager } from '../data/manager';
import { ExportService } from '../data/export';
import { getConfig } from '../config/AppConfig';
import { AdapterFactory } from '../config/AdapterFactory';

let mainWindow: BrowserWindow | null = null;
let automationEngine: AutomationEngine | null = null;
let dataManager: DataManager | null = null;
let exportService: ExportService | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  const config = getConfig();

  console.log('Initializing with config:', config);

  const automationAdapter = AdapterFactory.createAutomationAdapter(config.automation);
  const parserAdapter = AdapterFactory.createParserAdapter(config.parser);
  const databaseAdapter = AdapterFactory.createDatabaseAdapter(config.database);

  automationEngine = new AutomationEngine(automationAdapter, parserAdapter);
  dataManager = new DataManager(databaseAdapter);
  exportService = new ExportService();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  if (automationEngine) {
    await automationEngine.cleanup();
  }
});

ipcMain.handle('start-search', async (_event, keyword: string, options: any) => {
  try {
    if (!automationEngine) {
      throw new Error('Automation engine not initialized');
    }

    const results = await automationEngine.search(keyword, options);

    if (dataManager) {
      await dataManager.saveResults(results);
    }

    return { success: true, data: results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('batch-search', async (_event, keywords: string[], options: any) => {
  try {
    if (!automationEngine) {
      throw new Error('Automation engine not initialized');
    }

    const allResults = [];

    for (const keyword of keywords) {
      try {
        const results = await automationEngine.search(keyword, options);
        allResults.push(...results);

        if (mainWindow) {
          mainWindow.webContents.send('batch-progress', {
            current: keywords.indexOf(keyword) + 1,
            total: keywords.length,
            keyword,
          });
        }
      } catch (error: any) {
        console.error(`Error searching for "${keyword}":`, error.message);
      }
    }

    if (dataManager) {
      await dataManager.saveResults(allResults);
    }

    return { success: true, data: allResults };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-results', async () => {
  try {
    if (!dataManager) {
      throw new Error('Data manager not initialized');
    }

    const results = await dataManager.getAllResults();
    return { success: true, data: results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('clean-data', async () => {
  try {
    if (!dataManager) {
      throw new Error('Data manager not initialized');
    }

    const cleaned = await dataManager.cleanData();
    return { success: true, data: cleaned };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-data', async (_event, format: string, data: any[]) => {
  try {
    if (!exportService) {
      throw new Error('Export service not initialized');
    }

    const filePath = await exportService.export(format, data);
    return { success: true, filePath };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('clear-database', async () => {
  try {
    if (!dataManager) {
      throw new Error('Data manager not initialized');
    }

    await dataManager.clearAll();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-config', async () => {
  try {
    const config = getConfig();
    return { success: true, data: config };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});
