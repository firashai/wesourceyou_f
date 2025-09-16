import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiEye, FiTrash2, FiUsers, FiCalendar, FiMapPin, FiDollarSign } from 'react-icons/fi';
import './MyJobs.css';

const MyJobs = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      console.log('Fetching jobs with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('https://wesourceyoub2.vercel.app/companies/my/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Jobs data:', data);
        setJobs(data);
      } else {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        setError(`Failed to fetch jobs: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(`Error fetching jobs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    navigate('/jobs/create');
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleEditJob = (jobId) => {
    navigate(`/jobs/${jobId}/edit`);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`https://wesourceyoub2.vercel.app/jobs/${jobId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setJobs(jobs.filter(job => job.id !== jobId));
        } else {
          setError('Failed to delete job');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        setError('Error deleting job');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'closed':
        return 'status-closed';
      case 'draft':
        return 'status-draft';
      default:
        return 'status-default';
    }
  };

  if (loading) {
    return (
      <div className="my-jobs-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-jobs-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-jobs-container">
      <div className="my-jobs-header">
        <div className="header-content">
          <h1>{t('jobs.myJobs.title')}</h1>
          <p>{t('jobs.myJobs.subtitle')}</p>
        </div>
        <button className="create-job-btn" onClick={handleCreateJob}>
          <FiPlus />
          {t('jobs.createJob')}
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3>{t('jobs.myJobs.noJobs')}</h3>
          <p>{t('jobs.myJobs.noJobsDescription')}</p>
          <button className="create-job-btn primary" onClick={handleCreateJob}>
            <FiPlus />
            {t('jobs.createFirstJob')}
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3 className="job-title">{job.title}</h3>
                <span className={`job-status ${getStatusColor(job.status)}`}>
                  {job.status || 'Draft'}
                </span>
              </div>

              <div className="job-meta">
                <div className="meta-item">
                  <FiMapPin />
                  <span>{job.location || t('jobs.locationNotSpecified')}</span>
                </div>
                <div className="meta-item">
                  <FiDollarSign />
                  <span>{job.salary || t('jobs.salaryNotSpecified')}</span>
                </div>
                <div className="meta-item">
                  <FiCalendar />
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <FiUsers />
                  <span>{job.applicationsCount || 0} {t('jobs.applications')}</span>
                </div>
              </div>

              <p className="job-description">
                {job.description?.substring(0, 150)}...
              </p>

              <div className="job-actions">
                <button 
                  className="action-btn view" 
                  onClick={() => handleViewJob(job.id)}
                >
                  <FiEye />
                  {t('common.view')}
                </button>
                <button 
                  className="action-btn edit" 
                  onClick={() => handleEditJob(job.id)}
                >
                  <FiEdit />
                  {t('common.edit')}
                </button>
                <button 
                  className="action-btn delete" 
                  onClick={() => handleDeleteJob(job.id)}
                >
                  <FiTrash2 />
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
