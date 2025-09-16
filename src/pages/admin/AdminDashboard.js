import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiUsers, FiUserCheck, FiBriefcase, FiFileText, FiShoppingCart, FiClipboard, FiBarChart2 } from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('https://wesourceyoub2.vercel.app/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="unauthorized">{t('admin.unauthorized')}</div>;
  }

  const statCards = [
    {
      title: t('admin.totalUsers'),
      value: stats?.users?.total || 0,
      pending: stats?.users?.pending || 0,
      icon: FiUsers,
      color: 'blue',
      link: '/admin/users'
    },
    {
      title: t('admin.totalJournalists'),
      value: stats?.journalists?.total || 0,
      pending: stats?.journalists?.pending || 0,
      icon: FiUserCheck,
      color: 'green',
      link: '/admin/journalists'
    },
    {
      title: t('admin.totalCompanies'),
      value: stats?.companies?.total || 0,
      pending: stats?.companies?.pending || 0,
      icon: FiBriefcase,
      color: 'purple',
      link: '/admin/companies'
    },
    {
      title: t('admin.totalJobs'),
      value: stats?.jobs?.total || 0,
      pending: stats?.jobs?.pending || 0,
      icon: FiFileText,
      color: 'orange',
      link: '/admin/jobs'
    },
    {
      title: t('admin.totalMedia'),
      value: stats?.media?.total || 0,
      pending: stats?.media?.pending || 0,
      icon: FiClipboard,
      color: 'red',
      link: '/admin/media'
    },
    {
      title: t('admin.totalApplications'),
      value: stats?.applications?.total || 0,
      icon: FiBarChart2,
      color: 'teal',
      link: '/admin/applications'
    },
    {
      title: t('admin.totalPurchases'),
      value: stats?.purchases?.total || 0,
      icon: FiShoppingCart,
      color: 'indigo',
      link: '/admin/purchases'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>{t('admin.dashboard.title')}</h1>
        <p>{t('admin.dashboard.subtitle')}</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className={`stat-card ${card.color}`} onClick={() => window.location.href = card.link}>
            <div className="stat-icon">
              <card.icon />
            </div>
            <div className="stat-content">
              <h3>{card.title}</h3>
              <div className="stat-numbers">
                <span className="stat-value">{card.value}</span>
                {card.pending !== undefined && (
                  <span className="stat-pending">
                    {card.pending} {t('admin.pending')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>{t('admin.quickActions')}</h2>
        <div className="actions-grid">
          <div className="action-card" onClick={() => window.location.href = '/admin/journalists?approved=false'}>
            <FiUserCheck />
            <h3>{t('admin.reviewJournalists')}</h3>
            <p>{t('admin.reviewJournalistsDesc')}</p>
          </div>
          <div className="action-card" onClick={() => window.location.href = '/admin/companies?verified=false'}>
            <FiBriefcase />
            <h3>{t('admin.reviewCompanies')}</h3>
            <p>{t('admin.reviewCompaniesDesc')}</p>
          </div>
          <div className="action-card" onClick={() => window.location.href = '/admin/jobs?approved=false'}>
            <FiFileText />
            <h3>{t('admin.reviewJobs')}</h3>
            <p>{t('admin.reviewJobsDesc')}</p>
          </div>
          <div className="action-card" onClick={() => window.location.href = '/admin/media?approved=false'}>
            <FiClipboard />
            <h3>{t('admin.reviewMedia')}</h3>
            <p>{t('admin.reviewMediaDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
