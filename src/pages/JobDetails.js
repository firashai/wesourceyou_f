import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { FiMapPin, FiDollarSign, FiClock, FiUser, FiCalendar, FiEye, FiUsers } from 'react-icons/fi';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/jobs/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setJob(data);
      } else {
        setError('Failed to fetch job details');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Error fetching job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      alert('Please log in to apply for this job');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: parseInt(id),
          coverLetter: 'I am interested in this position.',
        }),
      });

      if (response.ok) {
        alert('Application submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Error submitting application');
    }
  };

  if (loading) {
    return (
      <div className="job-details-container">
        <div className="loading">{t('common.loading')}</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-container">
        <div className="error">{error || t('jobs.notFound')}</div>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <div className="job-details-header">
        <div className="job-title-section">
          <h1>{job.title}</h1>
          <div className="company-info">
            <span className="company-name">{job.company?.name}</span>
            {job.company?.logo && (
              <img src={job.company.logo} alt={job.company.name} className="company-logo" />
            )}
          </div>
        </div>
        
        <div className="job-meta">
          <div className="meta-item">
            <FiMapPin />
            <span>{job.locations?.join(', ') || t('jobs.locationNotSpecified')}</span>
          </div>
          <div className="meta-item">
            <FiDollarSign />
            <span>{job.salary ? `$${job.salary}` : t('jobs.salaryNotSpecified')}</span>
          </div>
          <div className="meta-item">
            <FiClock />
            <span>{job.jobType || t('jobs.typeNotSpecified')}</span>
          </div>
          <div className="meta-item">
            <FiCalendar />
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="job-stats">
          <div className="stat-item">
            <FiEye />
            <span>{job.views || 0} {t('jobs.views')}</span>
          </div>
          <div className="stat-item">
            <FiUsers />
            <span>{job.applications?.length || 0} {t('jobs.applications')}</span>
          </div>
        </div>
      </div>

      <div className="job-details-content">
        <div className="job-description">
          <h2>{t('jobs.description')}</h2>
          <p>{job.description}</p>
        </div>

        {job.requirements && (
          <div className="job-requirements">
            <h2>{t('jobs.requirements')}</h2>
            <ul>
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {job.benefits && (
          <div className="job-benefits">
            <h2>{t('jobs.benefits')}</h2>
            <ul>
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {job.deadline && (
          <div className="job-deadline">
            <h2>{t('jobs.deadline')}</h2>
            <p>{new Date(job.deadline).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="job-actions">
        {user?.role === 'journalist' && (
          <button className="apply-button" onClick={handleApply}>
            {t('jobs.apply')}
          </button>
        )}
        <button className="share-button">
          {t('jobs.share')}
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
