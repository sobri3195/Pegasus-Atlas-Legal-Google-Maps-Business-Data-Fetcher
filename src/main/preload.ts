import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  startSearch: (keyword: string, options: any) => 
    ipcRenderer.invoke('start-search', keyword, options),
  
  batchSearch: (keywords: string[], options: any) => 
    ipcRenderer.invoke('batch-search', keywords, options),
  
  getResults: () => 
    ipcRenderer.invoke('get-results'),
  
  cleanData: () => 
    ipcRenderer.invoke('clean-data'),
  
  exportData: (format: string, data: any[]) => 
    ipcRenderer.invoke('export-data', format, data),
  
  clearDatabase: () => 
    ipcRenderer.invoke('clear-database'),
  
  onBatchProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on('batch-progress', (_event, progress) => callback(progress));
  },
});
