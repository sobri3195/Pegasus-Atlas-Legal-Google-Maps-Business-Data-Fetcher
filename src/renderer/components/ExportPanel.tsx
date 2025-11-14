import React from 'react';

interface ExportPanelProps {
  onExport: (format: string) => void;
  onCleanData: () => void;
  onClearDatabase: () => void;
  loading: boolean;
  hasData: boolean;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  onExport,
  onCleanData,
  onClearDatabase,
  loading,
  hasData,
}) => {
  return (
    <div className="export-panel">
      <h2>📁 Data Management</h2>
      
      <div className="button-group">
        <h3>Export Data</h3>
        <button
          onClick={() => onExport('csv')}
          disabled={loading || !hasData}
          className="btn-secondary"
        >
          Export CSV
        </button>
        <button
          onClick={() => onExport('excel')}
          disabled={loading || !hasData}
          className="btn-secondary"
        >
          Export Excel
        </button>
        <button
          onClick={() => onExport('json')}
          disabled={loading || !hasData}
          className="btn-secondary"
        >
          Export JSON
        </button>
        <button
          onClick={() => onExport('pdf')}
          disabled={loading || !hasData}
          className="btn-secondary"
        >
          Export PDF
        </button>
      </div>

      <div className="button-group">
        <h3>Data Cleaning</h3>
        <button
          onClick={onCleanData}
          disabled={loading || !hasData}
          className="btn-secondary"
        >
          Clean & Deduplicate
        </button>
      </div>

      <div className="button-group">
        <h3>Database</h3>
        <button
          onClick={onClearDatabase}
          disabled={loading}
          className="btn-danger"
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;
