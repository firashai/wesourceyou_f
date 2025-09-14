import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiSave, FiX, FiBriefcase, FiMapPin, FiDollarSign, FiCalendar } from 'react-icons/fi';
import './CreateJob.css';

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: 'freelance',
    mediaWorkType: 'video_production',
    analystSpecialty: 'middle_eastern_affairs',
    experienceLevel: 'senior',
    preferredSkills: [],
    preferredLanguages: [],
    salary: {
      min: 0,
      max: 0,
      currency: 'USD',
      period: 'project'
    },
    benefits: [],
    requirements: '',
    projectDetails: '',
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    isUrgent: false,
    tags: [],
    categories: [],
    additionalInfo: '',
    contactInfo: {
      email: user?.email || '',
      phone: user?.phone || ''
    },
    applicationQuestions: []
  });

  useEffect(() => {
    fetchJobData();
  }, [id]);

  const fetchJobData = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch(`http://localhost:3001/jobs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const jobData = await response.json();
        setFormData({
          title: jobData.title || '',
          description: jobData.description || '',
          jobType: jobData.jobType || 'freelance',
          mediaWorkType: jobData.mediaWorkType || 'video_production',
          analystSpecialty: jobData.analystSpecialty || 'middle_eastern_affairs',
          experienceLevel: jobData.experienceLevel || 'senior',
          preferredSkills: jobData.preferredSkills || [],
          preferredLanguages: jobData.preferredLanguages || [],
          salary: jobData.salary || {
            min: 0,
            max: 0,
            currency: 'USD',
            period: 'project'
          },
          benefits: jobData.benefits || [],
          requirements: jobData.requirements || '',
          projectDetails: jobData.projectDetails || '',
          startDate: jobData.startDate ? new Date(jobData.startDate).toISOString().split('T')[0] : '',
          endDate: jobData.endDate ? new Date(jobData.endDate).toISOString().split('T')[0] : '',
          applicationDeadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline).toISOString().split('T')[0] : '',
          isUrgent: jobData.isUrgent || false,
          tags: jobData.tags || [],
          categories: jobData.categories || [],
          additionalInfo: jobData.additionalInfo || '',
          contactInfo: jobData.contactInfo || {
            email: user?.email || '',
            phone: user?.phone || ''
          },
          applicationQuestions: jobData.applicationQuestions || []
        });
      } else {
        setError('Failed to fetch job data');
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
      setError('Error fetching job data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate(`/jobs/${id}`);
        // Show success message
      } else {
        throw new Error('Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/jobs/my');
  };

  if (initialLoading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="create-job-container">
      <div className="create-job-header">
        <h1>{t('jobs.editJob')}</h1>
        <p>{t('jobs.editJobDescription')}</p>
      </div>

      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-section">
          <h2><FiBriefcase /> {t('jobs.basicInfo')}</h2>
          
          <div className="form-group">
            <label htmlFor="title">{t('jobs.title')} *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">{t('jobs.description')} *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              rows={5}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jobType">{t('jobs.jobType')} *</label>
              <select
                id="jobType"
                value={formData.jobType}
                onChange={(e) => handleInputChange('jobType', e.target.value)}
                required
              >
                <option value="freelance">{t('jobs.freelance')}</option>
                <option value="full_time">{t('jobs.fullTime')}</option>
                <option value="part_time">{t('jobs.partTime')}</option>
                <option value="contract">{t('jobs.contract')}</option>
                <option value="internship">{t('jobs.internship')}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mediaWorkType">{t('jobs.mediaWorkType')} *</label>
              <select
                id="mediaWorkType"
                value={formData.mediaWorkType}
                onChange={(e) => handleInputChange('mediaWorkType', e.target.value)}
                required
              >
                <option value="video_production">{t('jobs.videoProduction')}</option>
                <option value="photo_journalism">{t('jobs.photoJournalism')}</option>
                <option value="written_content">{t('jobs.writtenContent')}</option>
                <option value="audio_production">{t('jobs.audioProduction')}</option>
                <option value="social_media">{t('jobs.socialMedia')}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="analystSpecialty">{t('jobs.analystSpecialty')}</label>
              <select
                id="analystSpecialty"
                value={formData.analystSpecialty}
                onChange={(e) => handleInputChange('analystSpecialty', e.target.value)}
              >
                <option value="middle_eastern_affairs">{t('jobs.middleEasternAffairs')}</option>
                <option value="international_politics">{t('jobs.internationalPolitics')}</option>
                <option value="economic_analysis">{t('jobs.economicAnalysis')}</option>
                <option value="social_issues">{t('jobs.socialIssues')}</option>
                <option value="technology">{t('jobs.technology')}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experienceLevel">{t('jobs.experienceLevel')} *</label>
              <select
                id="experienceLevel"
                value={formData.experienceLevel}
                onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                required
              >
                <option value="entry">{t('jobs.entry')}</option>
                <option value="junior">{t('jobs.junior')}</option>
                <option value="mid">{t('jobs.mid')}</option>
                <option value="senior">{t('jobs.senior')}</option>
                <option value="expert">{t('jobs.expert')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2><FiDollarSign /> {t('jobs.compensation')}</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salaryMin">{t('jobs.salaryMin')}</label>
              <input
                type="number"
                id="salaryMin"
                value={formData.salary.min}
                onChange={(e) => handleInputChange('salary.min', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="salaryMax">{t('jobs.salaryMax')}</label>
              <input
                type="number"
                id="salaryMax"
                value={formData.salary.max}
                onChange={(e) => handleInputChange('salary.max', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="currency">{t('jobs.currency')}</label>
              <select
                id="currency"
                value={formData.salary.currency}
                onChange={(e) => handleInputChange('salary.currency', e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AED">AED</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="period">{t('jobs.period')}</label>
              <select
                id="period"
                value={formData.salary.period}
                onChange={(e) => handleInputChange('salary.period', e.target.value)}
              >
                <option value="hourly">{t('jobs.hourly')}</option>
                <option value="daily">{t('jobs.daily')}</option>
                <option value="weekly">{t('jobs.weekly')}</option>
                <option value="monthly">{t('jobs.monthly')}</option>
                <option value="project">{t('jobs.project')}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="benefits">{t('jobs.benefits')}</label>
            <input
              type="text"
              id="benefits"
              value={formData.benefits.join(', ')}
              onChange={(e) => handleArrayChange('benefits', e.target.value)}
              placeholder={t('jobs.benefitsPlaceholder')}
            />
          </div>
        </div>

        <div className="form-section">
          <h2><FiCalendar /> {t('jobs.timeline')}</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">{t('jobs.startDate')}</label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">{t('jobs.endDate')}</label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="applicationDeadline">{t('jobs.applicationDeadline')}</label>
            <input
              type="date"
              id="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
              />
              {t('jobs.isUrgent')}
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>{t('jobs.additionalInfo')}</h2>
          
          <div className="form-group">
            <label htmlFor="preferredSkills">{t('jobs.preferredSkills')}</label>
            <input
              type="text"
              id="preferredSkills"
              value={formData.preferredSkills.join(', ')}
              onChange={(e) => handleArrayChange('preferredSkills', e.target.value)}
              placeholder={t('jobs.skillsPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredLanguages">{t('jobs.preferredLanguages')}</label>
            <input
              type="text"
              id="preferredLanguages"
              value={formData.preferredLanguages.join(', ')}
              onChange={(e) => handleArrayChange('preferredLanguages', e.target.value)}
              placeholder={t('jobs.languagesPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements">{t('jobs.requirements')}</label>
            <textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectDetails">{t('jobs.projectDetails')}</label>
            <textarea
              id="projectDetails"
              value={formData.projectDetails}
              onChange={(e) => handleInputChange('projectDetails', e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">{t('jobs.tags')}</label>
            <input
              type="text"
              id="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleArrayChange('tags', e.target.value)}
              placeholder={t('jobs.tagsPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categories">{t('jobs.categories')}</label>
            <input
              type="text"
              id="categories"
              value={formData.categories.join(', ')}
              onChange={(e) => handleArrayChange('categories', e.target.value)}
              placeholder={t('jobs.categoriesPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">{t('jobs.additionalInfo')}</label>
            <textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-secondary">
            <FiX /> {t('common.cancel')}
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            <FiSave /> {loading ? t('common.updating') : t('common.update')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
