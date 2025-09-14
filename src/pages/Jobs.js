import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import './Jobs.css';

const Jobs = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3001/jobs');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      let filtered = [...jobs];

      // Filter by company if specified
      const companyId = searchParams.get('company');
      if (companyId) {
        filtered = filtered.filter(job => job.company?.id === parseInt(companyId));
      }

      // Filter by specific job if specified
      const jobId = searchParams.get('jobId');
      if (jobId) {
        filtered = filtered.filter(job => job.id === parseInt(jobId));
      }

      setFilteredJobs(filtered);
    }
  }, [jobs, searchParams]);

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const companyName = searchParams.get('companyName');

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>
          {companyName ? `${t('jobs.title')} - ${companyName}` : t('jobs.title')}
        </h1>
        <p>{t('jobs.subtitle')}</p>
        {companyName && (
          <p className="company-filter-notice">
            {t('jobs.showingJobsFor')}: {companyName}
          </p>
        )}
      </div>

      <div className="jobs-list">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="job-type">{job.jobType}</span>
              </div>
              <div className="job-company">{job.company?.name || 'Unknown Company'}</div>
              <div className="job-location">{job.location}</div>
              <div className="job-salary">
                {job.salary && typeof job.salary === 'object' 
                  ? `${job.salary.currency || 'USD'} ${job.salary.min || 0} - ${job.salary.max || 0}`
                  : job.salary || 'Salary not specified'
                }
              </div>
              <p className="job-description">{job.description}</p>
              <div className="job-footer">
                <span className="job-date">{t('jobs.posted')}: {new Date(job.createdAt).toLocaleDateString()}</span>
                <button className="apply-button">{t('jobs.applyNow')}</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-jobs">
            <p>{t('jobs.noJobsFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
