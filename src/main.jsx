import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress benign iframe/sandbox websocket connection rejections
window.addEventListener('unhandledrejection', (event) => {
  const msg = event?.reason?.message || String(event?.reason || '');
  if (
    msg.toLowerCase().includes('websocket') ||
    msg.includes('closed without opened')
  ) {
    event.preventDefault();
  }
});

// Register Service Worker for offline capability & local storage caching
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[SW] Registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
