import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiClipboard, FiEye, FiFilter, FiSearch } from 'react-icons/fi';
import './AdminApplications.css';

const AdminApplications = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications();
  }, [currentPage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/applications?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="unauthorized">{t('admin.unauthorized')}</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="header-content">
          <FiClipboard className="header-icon" />
          <div>
            <h1>{t('admin.applications.title')}</h1>
            <p>{t('admin.applications.subtitle')}</p>
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
                  <th>{t('admin.applications.journalist')}</th>
                  <th>{t('admin.applications.job')}</th>
                  <th>{t('admin.applications.company')}</th>
                  <th>{t('admin.applications.status')}</th>
                  <th>{t('admin.applications.appliedAt')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <div className="user-info">
                        <span className="user-name">
                          {application.journalist?.user?.firstName} {application.journalist?.user?.lastName}
                        </span>
                        <span className="user-email">{application.journalist?.user?.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="job-info">
                        <span className="job-title">{application.job?.title}</span>
                        <span className="job-type">{application.job?.jobType}</span>
                      </div>
                    </td>
                    <td>
                      <span className="company-name">
                        {application.job?.company?.name}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${application.status}`}>
                        {application.status}
                      </span>
                    </td>
                    <td>
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => window.open(`/applications/${application.id}`, '_blank')}
                          title={t('admin.actions.view')}
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {applications.length === 0 && (
            <div className="empty-state">
              <p>{t('admin.applications.noApplications')}</p>
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

export default AdminApplications;
