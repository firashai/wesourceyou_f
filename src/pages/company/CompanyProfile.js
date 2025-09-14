import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiEdit, FiSave, FiX, FiMapPin, FiGlobe, FiUsers, FiStar } from 'react-icons/fi';
import '../Profile.css';

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

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

  const isOwnProfile = !id || (user?.role === 'company' && user?.id === profile?.user?.id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const endpoint = isOwnProfile 
          ? 'http://localhost:3001/companies/my/profile'
          : `http://localhost:3001/companies/${id}`;
        
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (isOwnProfile && token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(endpoint, { headers });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProfile(data);
        setEditForm(data);
      } catch (error) {
        console.error('Error fetching company profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isOwnProfile, token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/companies/my/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        // Show success message
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div className="error">{t('common.profileNotFound')}</div>;
  }

  // Parse arrays safely
  const locations = parseArrayField(profile.locations);
  const languages = parseArrayField(profile.languages);
  const requiredServices = parseArrayField(profile.requiredServices);
  const specializations = parseArrayField(profile.specializations);
  const contactPersons = parseArrayField(profile.contactPersons);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile.logo || '/default-company-logo.png'} alt={profile.name} />
        </div>
        <div className="profile-info">
          <div className="profile-title-section">
            <h1>{profile.name}</h1>
            {isOwnProfile && (
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button className="action-btn primary" onClick={handleSave}>
                      <FiSave />
                      {t('common.save')}
                    </button>
                    <button className="action-btn secondary" onClick={handleCancel}>
                      <FiX />
                      {t('common.cancel')}
                    </button>
                  </>
                ) : (
                  <button className="action-btn primary" onClick={handleEdit}>
                    <FiEdit />
                    {t('common.edit')}
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="location">
            <FiMapPin />
            {profile.user?.city}, {profile.user?.country}
          </p>
          <p className="industry">{profile.industry}</p>
          <div className="rating">
            <FiStar />
            <span>{profile.rating || 0}</span>
            {profile.isVerified && (
              <span className="verified-badge">✓ {t('companies.verified')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>{t('companies.about')}</h2>
          {isEditing ? (
            <textarea
              value={editForm.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="4"
              placeholder={t('companies.aboutPlaceholder')}
            />
          ) : (
            <p>{profile.description}</p>
          )}
        </div>

        {isEditing ? (
          <div className="profile-section">
            <h2>{t('companies.mission')}</h2>
            <textarea
              value={editForm.mission || ''}
              onChange={(e) => handleInputChange('mission', e.target.value)}
              rows="3"
              placeholder={t('companies.missionPlaceholder')}
            />
          </div>
        ) : (
          profile.mission && (
            <div className="profile-section">
              <h2>{t('companies.mission')}</h2>
              <p>{profile.mission}</p>
            </div>
          )
        )}

        {isEditing ? (
          <div className="profile-section">
            <h2>{t('companies.vision')}</h2>
            <textarea
              value={editForm.vision || ''}
              onChange={(e) => handleInputChange('vision', e.target.value)}
              rows="3"
              placeholder={t('companies.visionPlaceholder')}
            />
          </div>
        ) : (
          profile.vision && (
            <div className="profile-section">
              <h2>{t('companies.vision')}</h2>
              <p>{profile.vision}</p>
            </div>
          )
        )}

        <div className="profile-section">
          <h2>{t('companies.details')}</h2>
          <div className="company-details">
            <div className="detail-item">
              <strong>{t('companies.size')}:</strong> 
              {isEditing ? (
                <select
                  value={editForm.companySize || ''}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                >
                  <option value="">{t('common.select')}</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              ) : (
                profile.companySize
              )}
            </div>
            <div className="detail-item">
              <strong>{t('companies.industry')}:</strong> 
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.industry || ''}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder={t('companies.industryPlaceholder')}
                />
              ) : (
                profile.industry
              )}
            </div>
            {isEditing ? (
              <div className="detail-item">
                <strong>{t('companies.website')}:</strong>
                <input
                  type="url"
                  value={editForm.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            ) : (
              profile.website && (
                <div className="detail-item">
                  <strong>{t('companies.website')}:</strong> 
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    <FiGlobe />
                    {profile.website}
                  </a>
                </div>
              )
            )}
            {locations.length > 0 && (
              <div className="detail-item">
                <strong>{t('companies.locations')}:</strong> {locations.join(', ')}
              </div>
            )}
            {languages.length > 0 && (
              <div className="detail-item">
                <strong>{t('companies.languages')}:</strong> {languages.join(', ')}
              </div>
            )}
          </div>
        </div>

        {requiredServices.length > 0 && (
          <div className="profile-section">
            <h2>{t('companies.requiredServices')}</h2>
            <div className="services-list">
              {requiredServices.map((service, index) => (
                <span key={index} className="service-tag">{service}</span>
              ))}
            </div>
          </div>
        )}

        {specializations.length > 0 && (
          <div className="profile-section">
            <h2>{t('companies.specializations')}</h2>
            <div className="specializations-list">
              {specializations.map((specialization, index) => (
                <span key={index} className="specialization-tag">{specialization}</span>
              ))}
            </div>
          </div>
        )}

        <div className="profile-section">
          <h2>{t('companies.contact')}</h2>
          <div className="contact-info">
            <p><strong>{t('common.email')}:</strong> {profile.user?.email}</p>
            <p><strong>{t('common.phone')}:</strong> {profile.user?.phone}</p>
            {contactPersons.length > 0 && (
              <div className="contact-persons">
                <strong>{t('companies.contactPersons')}:</strong>
                <ul>
                  {contactPersons.map((person, index) => (
                    <li key={index}>{person.name} - {person.role}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {profile.jobs && profile.jobs.length > 0 && (
          <div className="profile-section">
            <h2>{t('companies.activeJobs')}</h2>
            <div className="jobs-list">
              {profile.jobs.slice(0, 5).map(job => (
                <div key={job.id} className="job-item">
                  <h4>{job.title}</h4>
                  <p>{job.description}</p>
                  <span className="job-type">{job.jobType}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
