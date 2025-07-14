import { useState } from 'react';
import { generateShortcode } from '../utils/urlUtils';
import { logEvent } from '../utils/logger';

interface URLInput {
  url: string;
  validity: string;
  shortcode: string;
}

function HomePage() {
  const [inputs, setInputs] = useState<URLInput[]>([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState<any[]>([]);

  const handleChange = (index: number, field: keyof URLInput, value: string) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const addRow = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = async () => {
    const existing = JSON.parse(localStorage.getItem('shortUrls') || '{}');
    const allShortcodes = Object.keys(existing);

    const newResults: any[] = [];

    for (let input of inputs) {
      const { url, validity, shortcode } = input;

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        await logEvent('frontend', 'error', 'page', 'Invalid URL format submitted.');
        alert(`Invalid URL: ${url}`);
        continue;
      }

      let code = shortcode || generateShortcode(allShortcodes);

      if (allShortcodes.includes(code)) {
        await logEvent('frontend', 'error', 'page', `Shortcode collision: ${code}`);
        alert(`Shortcode ${code} already in use.`);
        continue;
      }

      const now = new Date();
      const expireDate = new Date(now.getTime() + ((validity ? parseInt(validity) : 30) * 60000));

      existing[code] = {
        originalUrl: url,
        createdAt: now.toISOString(),
        expiresAt: expireDate.toISOString(),
        clicks: []
      };

      newResults.push({ code, url, expiresAt: expireDate.toLocaleString() });
      allShortcodes.push(code);

      await logEvent('frontend', 'info', 'page', `Short URL created with code: ${code}`);
    }

    localStorage.setItem('shortUrls', JSON.stringify(existing));
    setResults(newResults);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>URL Shortener</h2>

      {inputs.map((input, index) => (
        <div key={index} style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Original URL"
            value={input.url}
            onChange={(e) => handleChange(index, 'url', e.target.value)}
            style={{ padding: '8px', marginRight: '10px', width: '300px' }}
          />
          <input
            type="number"
            placeholder="Validity (minutes)"
            value={input.validity}
            onChange={(e) => handleChange(index, 'validity', e.target.value)}
            style={{ padding: '8px', marginRight: '10px', width: '150px' }}
          />
          <input
            type="text"
            placeholder="Custom Shortcode (optional)"
            value={input.shortcode}
            onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
            style={{ padding: '8px', width: '200px' }}
          />
        </div>
      ))}

      <button onClick={addRow} disabled={inputs.length >= 5} style={{ marginRight: '10px', padding: '10px' }}>
        + Add Another URL
      </button>
      <button onClick={handleSubmit} style={{ padding: '10px' }}>Shorten URLs</button>

      <div style={{ marginTop: '30px' }}>
        {results.map((result, idx) => (
          <div key={idx} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
            <p>
              <strong>Short URL:</strong>{' '}
              <a href={`/${result.code}`} target="_blank" rel="noreferrer">
                {window.location.origin}/{result.code}
              </a>
            </p>
            <p><strong>Expires At:</strong> {result.expiresAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
