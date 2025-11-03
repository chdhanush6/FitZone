import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ adminData, onLogout }) {
  const [memberships, setMemberships] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, active, expired
  const [successMessage, setSuccessMessage] = useState('');

  const BACKEND_URL = "https://fitzone-1-bny6.onrender.com";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch memberships
      const filterQuery = filter !== 'all' ? `?status=${filter}` : '';
      const membershipsResponse = await fetch(
        `${BACKEND_URL}/api/admin/memberships${filterQuery}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Fetch stats
      const statsResponse = await fetch(
        `${BACKEND_URL}/api/admin/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const membershipsData = await membershipsResponse.json();
      const statsData = await statsResponse.json();

      if (membershipsData.success) {
        setMemberships(membershipsData.data);
      } else {
        setError(membershipsData.error || 'Failed to fetch memberships');
      }

      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filter, BACKEND_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (membershipId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `${BACKEND_URL}/api/admin/memberships/${membershipId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`Membership status updated to ${newStatus}`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchData(); // Refresh data
      } else {
        setError(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Unable to update status. Please try again.');
    }
  };

  const handleDeleteMembership = async (membershipId) => {
    if (!window.confirm('Are you sure you want to delete this membership?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(
        `${BACKEND_URL}/api/admin/memberships/${membershipId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Membership deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchData(); // Refresh data
      } else {
        setError(data.error || 'Failed to delete membership');
      }
    } catch (error) {
      console.error('Error deleting membership:', error);
      setError('Unable to delete membership. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'active': return 'status-active';
      case 'expired': return 'status-expired';
      default: return '';
    }
  };

  const getPlanBadgeClass = (plan) => {
    switch (plan) {
      case 'basic': return 'plan-basic';
      case 'pro': return 'plan-pro';
      case 'elite': return 'plan-elite';
      default: return '';
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {adminData.admin.username}</p>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Statistics Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">📊</div>
              <div className="stat-details">
                <h3>{stats.total}</h3>
                <p>Total Members</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending">⏳</div>
              <div className="stat-details">
                <h3>{stats.pending}</h3>
                <p>Pending</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon active">✅</div>
              <div className="stat-details">
                <h3>{stats.active}</h3>
                <p>Active</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon expired">❌</div>
              <div className="stat-details">
                <h3>{stats.expired}</h3>
                <p>Expired</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Members
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats?.pending || 0})
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active ({stats?.active || 0})
          </button>
          <button 
            className={filter === 'expired' ? 'active' : ''}
            onClick={() => setFilter('expired')}
          >
            Expired ({stats?.expired || 0})
          </button>
        </div>

        {/* Memberships Table */}
        <div className="memberships-section">
          <h2>
            {filter === 'all' ? 'All Memberships' : 
             filter === 'pending' ? 'New Registration Requests' :
             filter === 'active' ? 'Active Members' :
             'Expired Members'}
          </h2>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : memberships.length === 0 ? (
            <div className="no-data">No memberships found</div>
          ) : (
            <div className="table-container">
              <table className="memberships-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Special Requirements</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memberships.map((membership) => (
                    <tr key={membership._id}>
                      <td>{membership.fullName}</td>
                      <td>{membership.email}</td>
                      <td>{membership.phoneNumber}</td>
                      <td>
                        <span className={`plan-badge ${getPlanBadgeClass(membership.plan)}`}>
                          {membership.plan.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(membership.status)}`}>
                          {membership.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{formatDate(membership.startDate)}</td>
                      <td>{membership.specialRequirements || 'None'}</td>
                      <td>
                        <div className="action-buttons">
                          {membership.status === 'pending' && (
                            <button
                              className="approve-btn"
                              onClick={() => handleStatusChange(membership._id, 'active')}
                            >
                              Approve
                            </button>
                          )}
                          {membership.status === 'active' && (
                            <button
                              className="expire-btn"
                              onClick={() => handleStatusChange(membership._id, 'expired')}
                            >
                              Mark Expired
                            </button>
                          )}
                          {membership.status === 'expired' && (
                            <button
                              className="reactivate-btn"
                              onClick={() => handleStatusChange(membership._id, 'active')}
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteMembership(membership._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
