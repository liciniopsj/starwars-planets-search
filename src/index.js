import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NumericalFiltersProvider from './context/NumericalFiltersProvider';

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <NumericalFiltersProvider>
      <App />
    </NumericalFiltersProvider>,
  );
