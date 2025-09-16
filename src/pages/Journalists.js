import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiCamera, FiStar, FiAward, FiGlobe } from 'react-icons/fi';
import './Journalists.css';

const Journalists = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [journalists, setJournalists] = useState([]);
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
    const fetchJournalists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://wesourceyoub2.vercel.app/journalists');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setJournalists(data);
      } catch (error) {
        console.error('Error fetching journalists:', error);
        setError('Failed to load journalists');
      } finally {
        setLoading(false);
      }
    };

    fetchJournalists();
  }, []);

  const handleViewProfile = (journalistId) => {
    navigate(`/journalists/${journalistId}`);
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="journalists-container">
      <div className="journalists-header">
        <h1>{t('journalists.title')}</h1>
        <p>{t('journalists.subtitle')}</p>
      </div>

      <div className="journalists-list">
        {journalists.map((journalist) => {
          // Parse arrays safely for each journalist
          const languages = parseArrayField(journalist.languages);
          const skills = parseArrayField(journalist.skills);
          const certifications = parseArrayField(journalist.certifications);

          return (
            <div key={journalist.id} className="journalist-card">
              <div className="journalist-header">
                <div className="journalist-info">
                  <h3>{journalist.user?.firstName} {journalist.user?.lastName}</h3>
                  <div className="journalist-meta">
                    <span className="location">
                      <FiMapPin />
                      {journalist.user?.city}, {journalist.user?.country}
                    </span>
                    <span className="specialty">
                      <FiCamera />
                      {journalist.mediaWorkType}
                    </span>
                    <span className="experience">
                      {t('journalists.experience')}: {journalist.completedProjects || 0} {t('journalists.projects')}
                    </span>
                  </div>
                </div>
                <div className="journalist-rating">
                  <FiStar />
                  <span>{journalist.rating || 0}</span>
                  {journalist.isApproved && (
                    <span className="verified-badge">
                      <FiUser />
                      {t('journalists.verified')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="journalist-bio">
                <p>{journalist.bio}</p>
              </div>
              
              <div className="journalist-skills">
                <div className="skills-section">
                  <h4>{t('journalists.languages')}</h4>
                  <div className="skills-tags">
                    {languages.map((language, index) => (
                      <span key={index} className="skill-tag language-tag">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="skills-section">
                  <h4>{t('journalists.equipment')}</h4>
                  <div className="skills-tags">
                    {skills.map((skill, index) => (
                      <span key={index} className="skill-tag equipment-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {certifications.length > 0 && (
                <div className="journalist-awards">
                  <h4>{t('journalists.awards')}</h4>
                  <div className="awards-list">
                    {certifications.map((certification, index) => (
                      <div key={index} className="award-item">
                        <FiAward className="award-icon" />
                        <span>{certification}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="journalist-footer">
                <span className="media-count">
                  {journalist.completedProjects || 0} {t('journalists.mediaItems')}
                </span>
                <button 
                  className="view-profile-button"
                  onClick={() => handleViewProfile(journalist.id)}
                >
                  {t('journalists.viewProfile')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Journalists;
