import React from 'react';

interface ResultsTableProps {
  results: any[];
  loading: boolean;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, loading }) => {
  if (loading && results.length === 0) {
    return (
      <div className="results-table">
        <h2>📊 Results</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="results-table">
        <h2>📊 Results</h2>
        <div className="no-data">
          <p>No data yet. Start a search to see results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-table">
      <h2>📊 Results ({results.length})</h2>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result.id || index}>
                <td>{result.name}</td>
                <td>{result.address || '-'}</td>
                <td>{result.phone || '-'}</td>
                <td>
                  {result.website ? (
                    <a href={result.website} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td>{result.category || '-'}</td>
                <td>{new Date(result.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
