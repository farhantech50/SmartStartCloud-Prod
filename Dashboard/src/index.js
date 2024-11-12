import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { TokenContextProvider } from './context/TokenContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <TokenContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TokenContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);