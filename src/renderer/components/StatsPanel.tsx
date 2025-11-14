import React from 'react';

interface StatsPanelProps {
  stats: any;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  if (!stats) {
    return null;
  }

  return (
    <div className="stats-panel">
      <h2>📊 Statistics</h2>
      
      <div className="stat-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Records</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.withPhone}</div>
          <div className="stat-label">With Phone</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.withWebsite}</div>
          <div className="stat-label">With Website</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.withAddress}</div>
          <div className="stat-label">With Address</div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
