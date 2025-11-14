# Pegasus Atlas - API Documentation

## Electron IPC API

### Search Operations

#### `startSearch(keyword, options)`

Start a single search operation.

**Parameters:**
- `keyword` (string): Search keyword
- `options` (object):
  - `headless` (boolean): Run in headless mode
  - `maxResults` (number): Maximum results to return
  - `delay` (number): Delay in milliseconds
  - `humanBehavior` (boolean): Simulate human behavior

**Returns:** Promise<{ success: boolean, data?: BusinessData[], error?: string }>

**Example:**
```javascript
const result = await window.electronAPI.startSearch(
  'restaurants in Jakarta',
  {
    headless: true,
    maxResults: 50,
    delay: 1000,
    humanBehavior: true
  }
);
```

#### `batchSearch(keywords, options)`

Start a batch search with multiple keywords.

**Parameters:**
- `keywords` (string[]): Array of search keywords
- `options` (object): Same as startSearch

**Returns:** Promise<{ success: boolean, data?: BusinessData[], error?: string }>

**Example:**
```javascript
const result = await window.electronAPI.batchSearch(
  ['restaurants in Jakarta', 'cafes in Surabaya'],
  { headless: true, maxResults: 50 }
);
```

### Data Operations

#### `getResults()`

Retrieve all stored results.

**Returns:** Promise<{ success: boolean, data?: BusinessData[], error?: string }>

#### `cleanData()`

Clean and deduplicate stored data.

**Returns:** Promise<{ success: boolean, data?: BusinessData[], error?: string }>

#### `clearDatabase()`

Clear all stored data.

**Returns:** Promise<{ success: boolean, error?: string }>

### Export Operations

#### `exportData(format, data)`

Export data in specified format.

**Parameters:**
- `format` (string): 'csv', 'excel', 'json', or 'pdf'
- `data` (BusinessData[]): Data to export

**Returns:** Promise<{ success: boolean, filePath?: string, error?: string }>

**Example:**
```javascript
const result = await window.electronAPI.exportData('excel', results);
console.log(`Exported to: ${result.filePath}`);
```

### Events

#### `onBatchProgress(callback)`

Listen for batch search progress updates.

**Parameters:**
- `callback` (function): Called with progress object

**Progress Object:**
- `current` (number): Current item index
- `total` (number): Total items
- `keyword` (string): Current keyword

**Example:**
```javascript
window.electronAPI.onBatchProgress((progress) => {
  console.log(`Progress: ${progress.current}/${progress.total}`);
  console.log(`Current: ${progress.keyword}`);
});
```

## Data Types

### BusinessData

```typescript
interface BusinessData {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  category?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  metadata?: Record<string, any>;
  timestamp: number;
}
```

### SearchOptions

```typescript
interface SearchOptions {
  headless?: boolean;
  maxResults?: number;
  delay?: number;
  humanBehavior?: boolean;
}
```

## Internal APIs

### AutomationEngine

Main browser automation class.

**Methods:**
- `initialize(options)`: Initialize browser
- `search(keyword, options)`: Perform search
- `cleanup()`: Close browser and cleanup

### DataManager

Database and data management class.

**Methods:**
- `initialize()`: Initialize database
- `saveResults(results)`: Save results
- `getAllResults()`: Get all results
- `cleanData()`: Clean and deduplicate
- `clearAll()`: Clear database
- `getStats()`: Get statistics

### ExportService

Data export service class.

**Methods:**
- `export(format, data)`: Export data
- `exportToCSV(data, filePath)`: Export to CSV
- `exportToExcel(data, filePath)`: Export to Excel
- `exportToJSON(data, filePath)`: Export to JSON
- `exportToPDF(data, filePath)`: Export to PDF

## Utility Functions

### helpers.ts

**Functions:**
- `delay(ms)`: Async delay
- `randomDelay(min, max)`: Random delay
- `normalizeAddress(address)`: Normalize address string
- `normalizePhone(phone)`: Normalize phone number
- `generateId()`: Generate unique ID
- `sanitizeFilename(filename)`: Sanitize filename

## Error Handling

All API methods return promises that resolve to result objects:

```typescript
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

Always check `success` before accessing `data`:

```javascript
const result = await window.electronAPI.getResults();
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

## Best Practices

1. **Always handle errors:** Check success flag and handle error messages
2. **Use appropriate delays:** Balance speed and politeness
3. **Clean data regularly:** Remove duplicates to maintain data quality
4. **Export incrementally:** Don't wait to export all data at once
5. **Monitor progress:** Use progress events for batch operations

## Examples

### Complete Search Flow

```javascript
// Start search
const searchResult = await window.electronAPI.startSearch(
  'restaurants in Jakarta',
  { headless: true, maxResults: 50 }
);

if (searchResult.success) {
  // Get all results
  const allResults = await window.electronAPI.getResults();
  
  // Clean data
  await window.electronAPI.cleanData();
  
  // Export
  const exportResult = await window.electronAPI.exportData(
    'excel',
    allResults.data
  );
  
  console.log(`Exported to: ${exportResult.filePath}`);
}
```

### Batch Search with Progress

```javascript
// Listen for progress
window.electronAPI.onBatchProgress((progress) => {
  updateProgressBar(progress.current, progress.total);
});

// Start batch search
const result = await window.electronAPI.batchSearch(
  ['keyword1', 'keyword2', 'keyword3'],
  { headless: true, maxResults: 30 }
);

if (result.success) {
  console.log(`Found ${result.data.length} total results`);
}
```
