import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/logs`, {
          params: { admin_email: user.email }
        });
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setLogs(response.data.logs);
        }
      } catch (err) {
        setError('Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchLogs();
    }
  }, [user]);

  if (loading) return <div className="admin-loading">Loading logs...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>User Activity Logs</p>
      </div>
      
      <div className="admin-content">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.timestamp}</td>
                    <td>{log.email}</td>
                    <td>
                      <span className={`action-badge ${log.action}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No activity found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
