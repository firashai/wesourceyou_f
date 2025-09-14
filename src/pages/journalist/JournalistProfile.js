import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiEdit, FiSave, FiX, FiMapPin, FiMail, FiPhone, FiGlobe, FiStar } from 'react-icons/fi';
import '../Profile.css';

const JournalistProfile = () => {
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

  const isOwnProfile = !id || (user?.role === 'journalist' && user?.id === profile?.user?.id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const endpoint = isOwnProfile 
          ? 'http://localhost:3001/journalists/my/profile'
          : `http://localhost:3001/journalists/${id}`;
        
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
        console.error('Error fetching journalist profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isOwnProfile, token]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/journalists/my/profile', {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setEditForm(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleBooleanChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value === 'true'
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
  const skills = parseArrayField(profile.skills);
  const languages = parseArrayField(profile.languages);
  const certifications = parseArrayField(profile.certifications);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile.user?.profilePicture || '/default-avatar.png'} alt="Profile" />
        </div>
        <div className="profile-info">
          <div className="profile-title-section">
            <h1>{profile.user?.firstName} {profile.user?.lastName}</h1>
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
          <p className="profile-location">
            <FiMapPin />
            {profile.user?.city}, {profile.user?.country}
          </p>
          <p className="profile-specialty">{profile.mediaWorkType}</p>
          <div className="profile-rating">
            <FiStar />
            <span>{profile.rating || 0}</span>
            {profile.isVerified && (
              <span className="verified-badge">✓ {t('journalists.verified')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>{t('journalists.bio')}</h2>
          {isEditing ? (
            <textarea
              value={editForm.bio || ''}
              onChange={(e) => handleInputChange(e)}
              rows="4"
              placeholder={t('journalists.bioPlaceholder')}
            />
          ) : (
            <p>{profile.bio}</p>
          )}
        </div>

        <div className="profile-section">
          <h2>{t('journalists.skills')}</h2>
          {isEditing ? (
            <textarea
              value={Array.isArray(editForm.skills) ? editForm.skills.join(', ') : ''}
              onChange={(e) => handleArrayChange('skills', e.target.value)}
              rows="3"
              placeholder={t('journalists.skillsPlaceholder')}
            />
          ) : (
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2>{t('journalists.languages')}</h2>
          {isEditing ? (
            <textarea
              value={Array.isArray(editForm.languages) ? editForm.languages.join(', ') : ''}
              onChange={(e) => handleArrayChange('languages', e.target.value)}
              rows="3"
              placeholder={t('journalists.languagesPlaceholder')}
            />
          ) : (
            <div className="languages-grid">
              {languages.map((language, index) => (
                <span key={index} className="language-tag">{language}</span>
              ))}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2>{t('journalists.certifications')}</h2>
          {isEditing ? (
            <textarea
              value={Array.isArray(editForm.certifications) ? editForm.certifications.join(', ') : ''}
              onChange={(e) => handleArrayChange('certifications', e.target.value)}
              rows="3"
              placeholder={t('journalists.certificationsPlaceholder')}
            />
          ) : (
            <div className="certifications-grid">
              {certifications.map((certification, index) => (
                <span key={index} className="certification-tag">{certification}</span>
              ))}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2>{t('journalists.details')}</h2>
          <div className="journalist-details">
            <div className="detail-item">
              <strong>{t('journalists.mediaWorkType')}:</strong> 
              {isEditing ? (
                <select
                  value={editForm.mediaWorkType || ''}
                  onChange={(e) => handleInputChange(e)}
                >
                  <option value="">{t('common.select')}</option>
                  <option value="video_production">{t('journalists.videoProduction')}</option>
                  <option value="photo_journalism">{t('journalists.photoJournalism')}</option>
                  <option value="written_content">{t('journalists.writtenContent')}</option>
                  <option value="audio_production">{t('journalists.audioProduction')}</option>
                </select>
              ) : (
                profile.mediaWorkType
              )}
            </div>
            <div className="detail-item">
              <strong>{t('journalists.analystSpecialty')}:</strong> 
              {isEditing ? (
                <select
                  value={editForm.analystSpecialty || ''}
                  onChange={(e) => handleInputChange(e)}
                >
                  <option value="">{t('common.select')}</option>
                  <option value="middle_eastern_affairs">{t('journalists.middleEasternAffairs')}</option>
                  <option value="political_analysis">{t('journalists.politicalAnalysis')}</option>
                  <option value="economic_analysis">{t('journalists.economicAnalysis')}</option>
                  <option value="conflict_reporting">{t('journalists.conflictReporting')}</option>
                </select>
              ) : (
                profile.analystSpecialty
              )}
            </div>
            <div className="detail-item">
              <strong>{t('journalists.experienceLevel')}:</strong> 
              {isEditing ? (
                <select
                  value={editForm.experienceLevel || ''}
                  onChange={(e) => handleInputChange(e)}
                >
                  <option value="">{t('common.select')}</option>
                  <option value="junior">{t('journalists.junior')}</option>
                  <option value="mid_level">{t('journalists.midLevel')}</option>
                  <option value="senior">{t('journalists.senior')}</option>
                  <option value="expert">{t('journalists.expert')}</option>
                </select>
              ) : (
                profile.experienceLevel
              )}
            </div>
            <div className="detail-item">
              <strong>{t('journalists.yearsOfExperience')}:</strong> {profile.yearsOfExperience || 0}
            </div>
            <div className="detail-item">
              <strong>{t('journalists.completedProjects')}:</strong> {profile.completedProjects || 0}
            </div>
            <div className="detail-item">
              <strong>{t('journalists.hasCamera')}:</strong>
              {isEditing ? (
                <select
                  name="hasCamera"
                  value={editForm.hasCamera || false}
                  onChange={handleBooleanChange}
                  className="edit-select"
                >
                  <option value={true}>{t('journalists.yes')}</option>
                  <option value={false}>{t('journalists.no')}</option>
                </select>
              ) : (
                profile.hasCamera ? t('journalists.yes') : t('journalists.no')
              )}
            </div>
            {profile.hasCamera && (
              <div className="detail-item">
                <strong>{t('journalists.cameraType')}:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="cameraType"
                    value={editForm.cameraType || ''}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="e.g., Sony FX6, Canon EOS R5"
                  />
                ) : (
                  profile.cameraType
                )}
              </div>
            )}
            <div className="detail-item">
              <strong>{t('journalists.hasAudioEquipment')}:</strong>
              {isEditing ? (
                <select
                  name="hasAudioEquipment"
                  value={editForm.hasAudioEquipment || false}
                  onChange={handleBooleanChange}
                  className="edit-select"
                >
                  <option value={true}>{t('journalists.yes')}</option>
                  <option value={false}>{t('journalists.no')}</option>
                </select>
              ) : (
                profile.hasAudioEquipment ? t('journalists.yes') : t('journalists.no')
              )}
            </div>
            {profile.hasAudioEquipment && (
              <div className="detail-item">
                <strong>{t('journalists.audioEquipmentType')}:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="audioEquipmentType"
                    value={editForm.audioEquipmentType || ''}
                    onChange={handleInputChange}
                    className="edit-input"
                    placeholder="e.g., Sennheiser MKH416, Rode NTG5"
                  />
                ) : (
                  profile.audioEquipmentType
                )}
              </div>
            )}
            <div className="detail-item">
              <strong>{t('journalists.canTravel')}:</strong>
              {isEditing ? (
                <select
                  name="canTravel"
                  value={editForm.canTravel || false}
                  onChange={handleBooleanChange}
                  className="edit-select"
                >
                  <option value={true}>{t('journalists.yes')}</option>
                  <option value={false}>{t('journalists.no')}</option>
                </select>
              ) : (
                profile.canTravel ? t('journalists.yes') : t('journalists.no')
              )}
            </div>
            <div className="detail-item">
              <strong>{t('journalists.hourlyRate')}:</strong>
              {isEditing ? (
                <input
                  type="number"
                  name="hourlyRate"
                  value={editForm.hourlyRate || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 75.00"
                />
              ) : (
                profile.hourlyRate ? `$${profile.hourlyRate}/hour` : t('journalists.notSet')
              )}
            </div>
            <div className="detail-item">
              <strong>{t('journalists.dailyRate')}:</strong>
              {isEditing ? (
                <input
                  type="number"
                  name="dailyRate"
                  value={editForm.dailyRate || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 600.00"
                />
              ) : (
                profile.dailyRate ? `$${profile.dailyRate}/day` : t('journalists.notSet')
              )}
            </div>
            <div className="detail-item">
              <strong>{t('journalists.projectRate')}:</strong>
              {isEditing ? (
                <input
                  type="number"
                  name="projectRate"
                  value={editForm.projectRate || ''}
                  onChange={handleInputChange}
                  className="edit-input"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 2500.00"
                />
              ) : (
                profile.projectRate ? `$${profile.projectRate}/project` : t('journalists.notSet')
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>{t('journalists.previousWorkLinks')}</h2>
          {isEditing ? (
            <textarea
              name="previousWorkLinks"
              value={Array.isArray(editForm.previousWorkLinks) ? editForm.previousWorkLinks.join('\n') : ''}
              onChange={(e) => setEditForm(prev => ({
                ...prev,
                previousWorkLinks: e.target.value.split('\n').map(link => link.trim()).filter(link => link)
              }))}
              className="edit-textarea"
              placeholder="https://example.com/work1&#10;https://example.com/work2"
              rows="3"
            />
          ) : (
            <div className="previous-work-links">
              {profile.previousWorkLinks && profile.previousWorkLinks.length > 0 ? (
                profile.previousWorkLinks.map((link, index) => (
                  <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="work-link">
                    {link}
                  </a>
                ))
              ) : (
                <p>{t('journalists.noWorkLinks')}</p>
              )}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h2>{t('journalists.contact')}</h2>
          <div className="contact-info">
            <p><FiMail /> <strong>{t('common.email')}:</strong> {profile.user?.email}</p>
            <p><FiPhone /> <strong>{t('common.phone')}:</strong> {profile.user?.phoneNumber}</p>
            {profile.website && (
              <p><FiGlobe /> <strong>{t('journalists.website')}:</strong> 
                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                  {profile.website}
                </a>
              </p>
            )}
          </div>
        </div>

        {profile.jobApplications && profile.jobApplications.length > 0 && (
          <div className="profile-section">
            <h2>{t('journalists.recentApplications')}</h2>
            <div className="applications-list">
              {profile.jobApplications.slice(0, 5).map(application => (
                <div key={application.id} className="application-item">
                  <h4>{application.job?.title}</h4>
                  <p>{application.job?.company?.name}</p>
                  <span className="status">{application.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalistProfile;
