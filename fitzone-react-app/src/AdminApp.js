import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import './App.css';

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (token && user) {
      setIsAuthenticated(true);
      setAdminData({ admin: JSON.parse(user), token });
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    setAdminData(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setAdminData(null);
  };

  return (
    <div className="admin-app">
      {isAuthenticated ? (
        <AdminDashboard adminData={adminData} onLogout={handleLogout} />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default AdminApp;
