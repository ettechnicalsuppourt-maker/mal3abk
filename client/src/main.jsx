import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import './index.css';

const path = window.location.pathname;

let Component = App;
if (path === '/admin-login') {
  Component = AdminLogin;
} else if (path === '/admin') {
  Component = AdminDashboard;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>
);
