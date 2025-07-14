import { useEffect, useState } from 'react';
import { logEvent } from '../utils/logger';

function StatisticsPage() {
  const [records, setRecords] = useState<any>({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('shortUrls') || '{}');
    setRecords(data);

    logEvent('frontend', 'info', 'page', 'Visited statistics page.');
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Shortened URL Statistics</h2>

      {Object.keys(records).length === 0 && (
        <p>No URLs shortened yet.</p>
      )}

      {Object.keys(records).map((code) => {
        const record = records[code];
        return (
          <div key={code} style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
            <h3>{window.location.origin}/{code}</h3>
            <p><strong>Original URL:</strong> {record.originalUrl}</p>
            <p><strong>Created At:</strong> {new Date(record.createdAt).toLocaleString()}</p>
            <p><strong>Expires At:</strong> {new Date(record.expiresAt).toLocaleString()}</p>
            <p><strong>Total Clicks:</strong> {record.clicks.length}</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Timestamp</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Source</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {record.clicks.map((click: any, index: number) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                      {new Date(click.timestamp).toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                      {click.source}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                      {click.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default StatisticsPage;
