import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdminApp from './AdminApp';
import reportWebVitals from './reportWebVitals';

// Simple routing based on URL path
const AppRouter = () => {
  const path = window.location.pathname;
  
  // If path starts with /admin, show admin app
  if (path.startsWith('/admin')) {
    return <AdminApp />;
  }
  
  // Otherwise show main app
  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
