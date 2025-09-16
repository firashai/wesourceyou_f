import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiUser, FiBriefcase, FiCalendar, FiMapPin, FiDollarSign, FiFilter, FiSearch } from 'react-icons/fi';
import './Applications.css';

const Applications = () => {
  const { user, token } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState('all');



  useEffect(() => {
    fetchApplications();
  }, []);



  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('https://wesourceyoub2.vercel.app/companies/my/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        const errorText = await response.text();
        console.error('Applications response error:', errorText);
        setError(t('applications.fetchError', { status: response.status, statusText: response.statusText }));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(t('applications.error', { message: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/applications/${applicationId}`);
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleViewJournalist = (journalistId) => {
    navigate(`/journalists/${journalistId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'reviewing': return 'reviewing';
      case 'shortlisted': return 'shortlisted';
      case 'interviewed': return 'interviewed';
      case 'accepted': return 'accepted';
      case 'rejected': return 'rejected';
      case 'withdrawn': return 'withdrawn';
      default: return 'pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return t('applications.status.pending');
      case 'reviewing': return t('applications.status.reviewing');
      case 'shortlisted': return t('applications.status.shortlisted');
      case 'interviewed': return t('applications.status.interviewed');
      case 'accepted': return t('applications.status.accepted');
      case 'rejected': return t('applications.status.rejected');
      case 'withdrawn': return t('applications.status.withdrawn');
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return t('applications.notSpecified');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  // Filter applications based on search term, status, and job
  const filteredApplications = applications.filter(application => {
    const matchesSearch = searchTerm === '' || 
      application.journalist?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.journalist?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || application.status === filterStatus;
    const matchesJob = selectedJob === 'all' || application.job?.id?.toString() === selectedJob;

    return matchesSearch && matchesStatus && matchesJob;
  });

  // Get unique jobs for filter dropdown
  const uniqueJobs = [...new Set(applications.map(app => app.job?.id))].map(jobId => {
    const app = applications.find(a => a.job?.id === jobId);
    return { id: jobId, title: app?.job?.title };
  });

  if (loading) {
    return (
      <div className="applications-container">
        <div className="loading">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      
      <div className="applications-header">
        <div className="header-content">
          <h1>{t('applications.title')}</h1>
          <p>{t('applications.subtitle')}</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{applications.length}</span>
            <span className="stat-label">{t('applications.total')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{applications.filter(app => app.status === 'pending').length}</span>
            <span className="stat-label">{t('applications.pending')}</span>
          </div>
        </div>
      </div>

      <div className="applications-filters">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder={t('applications.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>{t('applications.filterByStatus')}</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">{t('applications.allStatuses')}</option>
              <option value="pending">{t('applications.status.pending')}</option>
              <option value="reviewing">{t('applications.status.reviewing')}</option>
              <option value="shortlisted">{t('applications.status.shortlisted')}</option>
              <option value="interviewed">{t('applications.status.interviewed')}</option>
              <option value="accepted">{t('applications.status.accepted')}</option>
              <option value="rejected">{t('applications.status.rejected')}</option>
              <option value="withdrawn">{t('applications.status.withdrawn')}</option>
            </select>
          </div>

          <div className="filter-group">
            <label>{t('applications.filterByJob')}</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="filter-select"
            >
              <option value="all">{t('applications.allJobs')}</option>
              {uniqueJobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{t('applications.noApplications')}</h3>
          <p>{t('applications.noApplicationsDescription')}</p>
        </div>
      ) : (
        <div className="applications-table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>{t('applications.table.applicant')}</th>
                <th>{t('applications.table.job')}</th>
                <th>{t('applications.table.status')}</th>
                <th>{t('applications.table.appliedDate')}</th>
                <th>{t('applications.table.proposedRate')}</th>
                <th>{t('applications.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(application => (
                <tr key={application.id} className="application-row">
                  <td className="applicant-cell">
                    <div className="applicant-info">
                      <div className="applicant-avatar">
                        <FiUser />
                      </div>
                      <div className="applicant-details">
                        <div className="applicant-name">
                          {application.journalist?.user?.firstName} {application.journalist?.user?.lastName}
                        </div>
                        <div className="applicant-email">
                          {application.journalist?.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="job-cell">
                    <div className="job-info">
                      <div className="job-title" onClick={() => handleViewJob(application.job?.id)}>
                        {application.job?.title}
                      </div>
                      <div className="job-location">
                        <FiMapPin /> {application.job?.location || t('applications.locationNotSpecified')}
                      </div>
                    </div>
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                  </td>
                  <td className="date-cell">
                    <div className="date-info">
                      <FiCalendar />
                      {formatDate(application.createdAt)}
                    </div>
                  </td>
                  <td className="rate-cell">
                    <div className="rate-info">
                      <FiDollarSign />
                      {application.proposedRate ? 
                        formatCurrency(application.proposedRate, application.proposedRateCurrency) :
                        t('applications.notSpecified')
                      }
                    </div>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        onClick={() => handleViewApplication(application.id)}
                        title={t('applications.viewDetails')}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="action-btn profile"
                        onClick={() => handleViewJournalist(application.journalist?.id)}
                        title={t('applications.viewProfile')}
                      >
                        <FiUser />
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
  );
};

export default Applications;
