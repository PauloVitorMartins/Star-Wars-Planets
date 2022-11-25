import React from 'react';
import ReactDOM from 'react-dom/client';
import AppProvider from './context/AppProvider';
import App from './App';

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <AppProvider>
      <App />
    </AppProvider>,
  );
