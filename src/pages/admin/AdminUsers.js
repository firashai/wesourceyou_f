import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiUsers, FiUserCheck, FiUserX, FiFilter, FiSearch, FiEdit, FiEye } from 'react-icons/fi';
import './AdminUsers.css';

const AdminUsers = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    role: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filters.status && { status: filters.status }),
        ...(filters.role && { role: filters.role })
      });

      const response = await fetch(`http://localhost:3001/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  if (!user || user.role !== 'admin') {
    return <div className="unauthorized">{t('admin.unauthorized')}</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="header-content">
          <FiUsers className="header-icon" />
          <div>
            <h1>{t('admin.users.title')}</h1>
            <p>{t('admin.users.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters">
          <div className="filter-group">
            <label>{t('admin.filters.status')}:</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">{t('admin.filters.all')}</option>
              <option value="active">{t('admin.status.approved')}</option>
              <option value="pending">{t('admin.status.pending')}</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="filter-group">
            <label>{t('admin.filters.role')}:</label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <option value="">{t('admin.filters.all')}</option>
              <option value="journalist">Journalist</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : (
        <>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.users.name')}</th>
                  <th>{t('admin.users.email')}</th>
                  <th>{t('admin.users.role')}</th>
                  <th>{t('admin.users.status')}</th>
                  <th>{t('admin.users.createdAt')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.id}>
                    <td>
                      <div className="user-info">
                        <span className="user-name">
                          {userItem.firstName} {userItem.lastName}
                        </span>
                      </div>
                    </td>
                    <td>{userItem.email}</td>
                    <td>
                      <span className={`role-badge ${userItem.role}`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${userItem.status}`}>
                        {userItem.status}
                      </span>
                    </td>
                    <td>
                      {new Date(userItem.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => {
                            if (userItem.role === 'journalist') {
                              window.open(`/journalists/${userItem.id}`, '_blank');
                            } else if (userItem.role === 'company') {
                              window.open(`/companies/${userItem.id}`, '_blank');
                            } else {
                              window.open(`/profile/${userItem.role}`, '_blank');
                            }
                          }}
                          title={t('admin.actions.view')}
                        >
                          <FiEye />
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => {
                            if (userItem.role === 'journalist') {
                              window.open(`/journalists/${userItem.id}`, '_blank');
                            } else if (userItem.role === 'company') {
                              window.open(`/companies/${userItem.id}`, '_blank');
                            } else {
                              window.open(`/profile/${userItem.role}`, '_blank');
                            }
                          }}
                          title={t('admin.actions.edit')}
                        >
                          <FiEdit />
                        </button>
                        {userItem.status === 'pending' && (
                          <>
                            <button
                              className="action-btn approve"
                              onClick={() => updateUserStatus(userItem.id, 'active')}
                              title={t('admin.actions.approve')}
                            >
                              <FiUserCheck />
                            </button>
                            <button
                              className="action-btn reject"
                              onClick={() => updateUserStatus(userItem.id, 'suspended')}
                              title={t('admin.actions.reject')}
                            >
                              <FiUserX />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="empty-state">
              <p>{t('admin.users.noUsers')}</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsers;
