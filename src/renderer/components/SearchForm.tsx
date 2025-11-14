import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (keyword: string, options: any) => void;
  onBatchSearch: (keywords: string[], options: any) => void;
  loading: boolean;
  progress: any;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onBatchSearch, loading, progress }) => {
  const [keyword, setKeyword] = useState('');
  const [batchKeywords, setBatchKeywords] = useState('');
  const [headless, setHeadless] = useState(true);
  const [maxResults, setMaxResults] = useState(50);
  const [delay, setDelay] = useState(1000);
  const [humanBehavior, setHumanBehavior] = useState(true);
  const [isBatchMode, setIsBatchMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const options = {
      headless,
      maxResults,
      delay,
      humanBehavior,
    };

    if (isBatchMode) {
      const keywords = batchKeywords
        .split('\n')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      if (keywords.length === 0) {
        alert('Please enter at least one keyword');
        return;
      }
      
      onBatchSearch(keywords, options);
    } else {
      if (!keyword.trim()) {
        alert('Please enter a keyword');
        return;
      }
      
      onSearch(keyword, options);
    }
  };

  return (
    <div className="search-form">
      <h2>🔍 Search Configuration</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isBatchMode}
              onChange={(e) => setIsBatchMode(e.target.checked)}
            />
            Batch Mode
          </label>
        </div>

        {!isBatchMode ? (
          <div className="form-group">
            <label>Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., restaurants in Jakarta"
              disabled={loading}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Keywords (one per line)</label>
            <textarea
              value={batchKeywords}
              onChange={(e) => setBatchKeywords(e.target.value)}
              placeholder="restaurants in Jakarta&#10;cafes in Surabaya&#10;hotels in Bali"
              rows={5}
              disabled={loading}
            />
          </div>
        )}

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={headless}
              onChange={(e) => setHeadless(e.target.checked)}
              disabled={loading}
            />
            Headless Mode
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={humanBehavior}
              onChange={(e) => setHumanBehavior(e.target.checked)}
              disabled={loading}
            />
            Simulate Human Behavior
          </label>
        </div>

        <div className="form-group">
          <label>Max Results</label>
          <input
            type="number"
            value={maxResults}
            onChange={(e) => setMaxResults(parseInt(e.target.value))}
            min={1}
            max={200}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Delay (ms)</label>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value))}
            min={0}
            max={10000}
            step={100}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Processing...' : isBatchMode ? 'Start Batch Search' : 'Start Search'}
        </button>

        {progress && (
          <div className="progress-info">
            <p>Progress: {progress.current} / {progress.total}</p>
            <p>Current: {progress.keyword}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;
