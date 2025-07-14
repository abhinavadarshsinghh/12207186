import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { logEvent } from '../utils/logger';

function RedirectHandler() {
  const { shortcode } = useParams();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('shortUrls') || '{}');
    const record = data[shortcode || ''];

    if (record) {
      record.clicks.push({
        timestamp: new Date().toISOString(),
        source: document.referrer || 'Direct Access',
        location: 'Unknown'
      });

      localStorage.setItem('shortUrls', JSON.stringify(data));

      logEvent('frontend', 'info', 'page', `Redirected to original URL for shortcode: ${shortcode}`);

      window.location.href = record.originalUrl;
    } else {
      alert('Invalid Short URL.');
      logEvent('frontend', 'error', 'page', `Invalid shortcode accessed: ${shortcode}`);
    }
  }, [shortcode]);

  return null;
}

export default RedirectHandler;