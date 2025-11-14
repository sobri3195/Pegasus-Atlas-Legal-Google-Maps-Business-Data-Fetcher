import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import ExportPanel from './components/ExportPanel';
import StatsPanel from './components/StatsPanel';

declare global {
  interface Window {
    electronAPI: {
      startSearch: (keyword: string, options: any) => Promise<any>;
      batchSearch: (keywords: string[], options: any) => Promise<any>;
      getResults: () => Promise<any>;
      cleanData: () => Promise<any>;
      exportData: (format: string, data: any[]) => Promise<any>;
      clearDatabase: () => Promise<any>;
      onBatchProgress: (callback: (progress: any) => void) => void;
    };
  }
}

const App: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadResults();
    
    window.electronAPI.onBatchProgress((progress) => {
      setProgress(progress);
    });
  }, []);

  const loadResults = async () => {
    try {
      const response = await window.electronAPI.getResults();
      if (response.success) {
        setResults(response.data);
        updateStats(response.data);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const updateStats = (data: any[]) => {
    const stats = {
      total: data.length,
      withPhone: data.filter(r => r.phone).length,
      withWebsite: data.filter(r => r.website).length,
      withAddress: data.filter(r => r.address).length,
    };
    setStats(stats);
  };

  const handleSearch = async (keyword: string, options: any) => {
    setLoading(true);
    setProgress(null);
    
    try {
      const response = await window.electronAPI.startSearch(keyword, options);
      
      if (response.success) {
        await loadResults();
        alert(`Search completed! Found ${response.data.length} results.`);
      } else {
        alert(`Search failed: ${response.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSearch = async (keywords: string[], options: any) => {
    setLoading(true);
    setProgress({ current: 0, total: keywords.length });
    
    try {
      const response = await window.electronAPI.batchSearch(keywords, options);
      
      if (response.success) {
        await loadResults();
        alert(`Batch search completed! Found ${response.data.length} total results.`);
      } else {
        alert(`Batch search failed: ${response.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const handleCleanData = async () => {
    setLoading(true);
    
    try {
      const response = await window.electronAPI.cleanData();
      
      if (response.success) {
        await loadResults();
        alert('Data cleaned successfully!');
      } else {
        alert(`Data cleaning failed: ${response.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: string) => {
    setLoading(true);
    
    try {
      const response = await window.electronAPI.exportData(format, results);
      
      if (response.success) {
        alert(`Data exported successfully to:\n${response.filePath}`);
      } else {
        alert(`Export failed: ${response.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await window.electronAPI.clearDatabase();
      
      if (response.success) {
        await loadResults();
        alert('Database cleared successfully!');
      } else {
        alert(`Clear failed: ${response.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Pegasus Atlas</h1>
        <p>Automated Business Data Collector</p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <SearchForm
            onSearch={handleSearch}
            onBatchSearch={handleBatchSearch}
            loading={loading}
            progress={progress}
          />
          
          <StatsPanel stats={stats} />
          
          <ExportPanel
            onExport={handleExport}
            onCleanData={handleCleanData}
            onClearDatabase={handleClearDatabase}
            loading={loading}
            hasData={results.length > 0}
          />
        </div>

        <div className="right-panel">
          <ResultsTable results={results} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default App;
