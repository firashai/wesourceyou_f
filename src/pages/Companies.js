import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiUsers, FiGlobe, FiStar } from 'react-icons/fi';
import './Companies.css';

const Companies = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely parse JSON arrays
  const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch (error) {
      console.warn('Failed to parse field as JSON:', field);
      return [];
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://wesourceyoub2.vercel.app/companies');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleViewJobs = (companyId, companyName) => {
    navigate(`/jobs?company=${companyId}&companyName=${encodeURIComponent(companyName)}`);
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="companies-container">
      <div className="companies-header">
        <h1>{t('companies.title')}</h1>
        <p>{t('companies.subtitle')}</p>
      </div>

      <div className="companies-list">
        {companies.map((company) => {
          // Parse locations safely
          const locations = parseArrayField(company.locations);
          const locationDisplay = locations.length > 0 
            ? locations.join(', ') 
            : `${company.user?.city}, ${company.user?.country}`;

          return (
            <div key={company.id} className="company-card">
              <div className="company-header">
                <div className="company-info">
                  <div className="company-name-section">
                    <h3>{company.name}</h3>
                    {company.isVerified && (
                      <span className="verified-badge">
                        <FiStar /> {t('companies.verified')}
                      </span>
                    )}
                  </div>
                  <div className="company-rating">
                    <FiStar className="star-icon" />
                    <span>{company.rating || 0}</span>
                  </div>
                </div>
              </div>
              
              <p className="company-description">{company.description}</p>
              
              <div className="company-details">
                <div className="detail-item">
                  <FiHome className="detail-icon" />
                  <span>{company.industry}</span>
                </div>
                <div className="detail-item">
                  <FiMapPin className="detail-icon" />
                  <span>{locationDisplay}</span>
                </div>
                <div className="detail-item">
                  <FiUsers className="detail-icon" />
                  <span>{company.companySize}</span>
                </div>
                <div className="detail-item">
                  <FiGlobe className="detail-icon" />
                  <span>{company.website}</span>
                </div>
              </div>
              
              <div className="company-footer">
                <span className="active-jobs">
                  {company.jobs?.length || 0} {t('companies.activeJobs')}
                </span>
                <button
                  className="view-jobs-button"
                  onClick={() => handleViewJobs(company.id, company.name)}
                >
                  {t('companies.viewJobs')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Companies;
