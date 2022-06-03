import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { baseRoutes } from './routes';
console.log(baseRoutes);
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        {baseRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.component()}
          />
        ))}
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
