import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiPlus, FiEdit, FiEye, FiBriefcase, FiUsers, FiDollarSign, FiTrendingUp, FiVideo } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalMediaContent: 0,
    totalRevenue: 0
  });
  const [companyJobs, setCompanyJobs] = useState([]);
  const [companyApplications, setCompanyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'company') {
      fetchCompanyData();
    } else {
      // For other roles, use mock data for now
      setStats({
        totalJobs: 25,
        totalApplications: 12,
        totalMediaContent: 8,
        totalRevenue: 2500
      });
      setLoading(false);
    }
  }, [user]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch company jobs
      const jobsResponse = await fetch('http://localhost:3001/companies/my/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Jobs response status:', jobsResponse.status);
      
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        console.log('Jobs data:', jobsData);
        setCompanyJobs(jobsData);
        setStats(prev => ({ ...prev, totalJobs: jobsData.length }));
      } else {
        const errorText = await jobsResponse.text();
        console.error('Jobs response error:', errorText);
      }

      // Fetch company applications
      const applicationsResponse = await fetch('http://localhost:3001/companies/my/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        setCompanyApplications(applicationsData);
        setStats(prev => ({ ...prev, totalApplications: applicationsData.length }));
      }

      // Fetch media content stats
      const mediaResponse = await fetch('http://localhost:3001/media-content/my/content', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        const totalRevenue = mediaData.reduce((sum, media) => sum + (media.totalRevenue || 0), 0);
        setStats(prev => ({ 
          ...prev, 
          totalMediaContent: mediaData.length,
          totalRevenue: totalRevenue
        }));
      }

    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = () => {
    navigate('/jobs/create');
  };

  const handleViewProfile = () => {
    navigate(`/profile/${user?.role}`);
  };

  const handleViewJobs = () => {
    navigate('/jobs/my');
  };

  const handleViewApplications = () => {
    navigate('/applications');
  };

  const handleViewMedia = () => {
    navigate('/media/my');
  };

  const handleUploadMedia = () => {
    navigate('/media/upload');
  };

  const renderJournalistDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-actions">
        <button className="action-button primary" onClick={handleUploadMedia}>
          <FiPlus />
          {t('dashboard.uploadMedia')}
        </button>
        <button className="action-button secondary" onClick={handleViewProfile}>
          <FiEdit />
          {t('dashboard.editProfile')}
        </button>
        <button className="action-button secondary" onClick={handleViewMedia}>
          <FiVideo />
          {t('dashboard.viewMedia')}
        </button>
        <button className="action-button secondary" onClick={() => navigate('/jobs')}>
          <FiBriefcase />
          {t('dashboard.browseJobs')}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{t('dashboard.mediaContent')}</h3>
          <p className="stat-number">{stats.totalMediaContent}</p>
          <FiVideo className="stat-icon" />
        </div>
        <div className="stat-card">
          <h3>{t('dashboard.applications')}</h3>
          <p className="stat-number">{stats.totalApplications}</p>
          <FiUsers className="stat-icon" />
        </div>
        <div className="stat-card">
          <h3>{t('dashboard.mediaSales')}</h3>
          <p className="stat-number">8</p>
          <FiTrendingUp className="stat-icon" />
        </div>
        <div className="stat-card">
          <h3>{t('dashboard.totalRevenue')}</h3>
          <p className="stat-number">${stats.totalRevenue}</p>
          <FiDollarSign className="stat-icon" />
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>{t('dashboard.recentActivity')}</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📹</div>
              <div className="activity-content">
                <p>{t('dashboard.activity.mediaUploaded')}</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💼</div>
              <div className="activity-content">
                <p>{t('dashboard.activity.jobApplied')}</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💰</div>
              <div className="activity-content">
                <p>{t('dashboard.activity.mediaSold')}</p>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanyDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-actions">
        <button className="action-button primary" onClick={handleAddJob}>
          <FiPlus />
          {t('dashboard.addJob')}
        </button>
        <button className="action-button secondary" onClick={handleViewProfile}>
          <FiEdit />
          {t('dashboard.editProfile')}
        </button>
        <button className="action-button secondary" onClick={handleViewJobs}>
          <FiBriefcase />
          {t('dashboard.viewJobs')}
        </button>
        <button className="action-button secondary" onClick={handleViewApplications}>
          <FiUsers />
          {t('dashboard.viewApplications')}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{t('dashboard.activeJobs')}</h3>
          <p className="stat-number">{stats.totalJobs}</p>
          <FiBriefcase className="stat-icon" />
        </div>
        <div className="stat-card">
          <h3>{t('dashboard.applications')}</h3>
          <p className="stat-number">{stats.totalApplications}</p>
          <FiUsers className="stat-icon" />
        </div>
        <div className="stat-card">
          <h3>{t('dashboard.mediaPurchases')}</h3>
          <p className="stat-number">8</p>
          <FiTrendingUp className="stat-icon" />
        </div>
        <div className="stat-card">
          <h3>{t('dashboard.profileViews')}</h3>
          <p className="stat-number">89</p>
          <FiEye className="stat-icon" />
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>{t('dashboard.recentJobs')}</h2>
          <div className="jobs-list">
            {companyJobs.slice(0, 3).map(job => (
              <div key={job.id} className="job-item">
                <h4>{job.title}</h4>
                <p>{job.description.substring(0, 100)}...</p>
                <span className="job-status">{job.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>{t('dashboard.recentApplications')}</h2>
          <div className="applications-list">
            {companyApplications.slice(0, 3).map(application => (
              <div key={application.id} className="application-item">
                <h4>{application.journalist?.user?.firstName} {application.journalist?.user?.lastName}</h4>
                <p>Applied for: {application.job?.title}</p>
                <span className="application-status">{application.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-actions">
        <button className="action-button primary" onClick={() => navigate('/admin/journalists')}>
          <FiUsers />
          {t('dashboard.manageJournalists')}
        </button>
        <button className="action-button secondary" onClick={() => navigate('/admin/companies')}>
          <FiBriefcase />
          {t('dashboard.manageCompanies')}
        </button>
        <button className="action-button secondary" onClick={() => navigate('/admin/jobs')}>
          <FiBriefcase />
          {t('dashboard.manageJobs')}
        </button>
        <button className="action-button secondary" onClick={() => navigate('/admin/media')}>
          <FiVideo />
          {t('dashboard.manageMedia')}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{t('dashboard.totalUsers')}</h3>
          <p className="stat-number">1,234</p>
          <FiUsers className="stat-icon" />
        </div>
        <div className="stat-card">
          <h3>{t('dashboard.pendingApprovals')}</h3>
          <p className="stat-number">45</p>
          <FiEye className="stat-icon" />
        </div>
        <div className="stat-card">
          <h3>{t('dashboard.activeJobs')}</h3>
          <p className="stat-number">89</p>
          <FiBriefcase className="stat-icon" />
        </div>
        <div className="stat-card">
          <h3>{t('dashboard.totalRevenue')}</h3>
          <p className="stat-number">$12,345</p>
          <FiDollarSign className="stat-icon" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboard.welcome')}, {user?.firstName || 'User'}!</h1>
        <p>{t('dashboard.subtitle')}</p>
      </div>

      {user?.role === 'journalist' && renderJournalistDashboard()}
      {user?.role === 'company' && renderCompanyDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
    </div>
  );
};

export default Dashboard;
