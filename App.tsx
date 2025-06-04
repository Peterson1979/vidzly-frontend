
// Temporary App.tsx for debugging the white screen issue
import React from 'react';

const App: React.FC = () => {
  // Basic effect to apply dark/light mode class for visibility
  React.useEffect(() => {
    const isDarkModePreferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkModePreferred) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Also update indicator if it exists
    const indicator = document.getElementById('theme-indicator');
    if (indicator) {
        indicator.textContent = isDarkModePreferred ? 'Dark' : 'Light';
    }
  }, []);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', boxSizing: 'border-box' }}>
      {/* Ensure styles are applied for visibility */}
      <style>{`
        body { margin: 0; font-family: sans-serif; }
        :root { --color-background: #FFFFFF; --color-foreground: #1F2937; }
        .dark { --color-background: #111827; --color-foreground: #F3F4F6; }
        .debug-container { background-color: var(--color-background); color: var(--color-foreground); padding: 20px; border: 2px solid red; }
      `}</style>
      <div className="debug-container">
        <h1>Vidzly Test Page</h1>
        <p>If you can see this, the basic React setup, build process, and CDN imports are working.</p>
        <p>The white screen issue is likely within the original App.tsx's components, routes, context providers, or complex state logic.</p>
        <p>Current theme active: <span id="theme-indicator">{document.documentElement.classList.contains('dark') ? 'Dark' : 'Light'}</span> (based on initial detection)</p>
        <p>Check the browser's developer console (F12 or Ctrl+Shift+I, then Console tab) for any errors from the original application code.</p>
      </div>
    </div>
  );
};

export default App;
