import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiSave, FiX, FiBriefcase, FiMapPin, FiDollarSign, FiCalendar } from 'react-icons/fi';
import './CreateJob.css';

const CreateJob = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
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
      const response = await fetch('http://localhost:3001/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newJob = await response.json();
        navigate(`/jobs/${newJob.id}`);
        // Show success message
      } else {
        throw new Error('Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="create-job-container">
      <div className="create-job-header">
        <h1>{t('jobs.createJob')}</h1>
        <p>{t('jobs.createJobDescription')}</p>
      </div>

      <form onSubmit={handleSubmit} className="create-job-form">
        <div className="form-section">
          <h2>{t('jobs.basicInfo')}</h2>
          
          <div className="form-group">
            <label>{t('jobs.title')} *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('jobs.titlePlaceholder')}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('jobs.description')} *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('jobs.descriptionPlaceholder')}
              rows="6"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('jobs.jobType')} *</label>
              <select
                value={formData.jobType}
                onChange={(e) => handleInputChange('jobType', e.target.value)}
                required
              >
                <option value="freelance">{t('jobs.freelance')}</option>
                <option value="fulltime">{t('jobs.fulltime')}</option>
                <option value="parttime">{t('jobs.parttime')}</option>
                <option value="contract">{t('jobs.contract')}</option>
                <option value="project">{t('jobs.project')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('jobs.mediaWorkType')} *</label>
              <select
                value={formData.mediaWorkType}
                onChange={(e) => handleInputChange('mediaWorkType', e.target.value)}
                required
              >
                <option value="video_production">{t('jobs.videoProduction')}</option>
                <option value="photo_journalism">{t('jobs.photoJournalism')}</option>
                <option value="written_content">{t('jobs.writtenContent')}</option>
                <option value="audio_production">{t('jobs.audioProduction')}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('jobs.analystSpecialty')}</label>
              <select
                value={formData.analystSpecialty}
                onChange={(e) => handleInputChange('analystSpecialty', e.target.value)}
              >
                <option value="middle_eastern_affairs">{t('jobs.middleEasternAffairs')}</option>
                <option value="political_analysis">{t('jobs.politicalAnalysis')}</option>
                <option value="economic_analysis">{t('jobs.economicAnalysis')}</option>
                <option value="conflict_reporting">{t('jobs.conflictReporting')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('jobs.experienceLevel')} *</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                required
              >
                <option value="junior">{t('jobs.junior')}</option>
                <option value="mid_level">{t('jobs.midLevel')}</option>
                <option value="senior">{t('jobs.senior')}</option>
                <option value="expert">{t('jobs.expert')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>{t('jobs.requirements')}</h2>
          
          <div className="form-group">
            <label>{t('jobs.preferredSkills')}</label>
            <input
              type="text"
              value={formData.preferredSkills.join(', ')}
              onChange={(e) => handleArrayChange('preferredSkills', e.target.value)}
              placeholder={t('jobs.skillsPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('jobs.preferredLanguages')}</label>
            <input
              type="text"
              value={formData.preferredLanguages.join(', ')}
              onChange={(e) => handleArrayChange('preferredLanguages', e.target.value)}
              placeholder={t('jobs.languagesPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('jobs.requirements')}</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder={t('jobs.requirementsPlaceholder')}
              rows="4"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>{t('jobs.compensation')}</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>{t('jobs.minSalary')}</label>
              <input
                type="number"
                value={formData.salary.min}
                onChange={(e) => handleInputChange('salary.min', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>{t('jobs.maxSalary')}</label>
              <input
                type="number"
                value={formData.salary.max}
                onChange={(e) => handleInputChange('salary.max', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('jobs.currency')}</label>
              <select
                value={formData.salary.currency}
                onChange={(e) => handleInputChange('salary.currency', e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('jobs.period')}</label>
              <select
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
            <label>{t('jobs.benefits')}</label>
            <input
              type="text"
              value={formData.benefits.join(', ')}
              onChange={(e) => handleArrayChange('benefits', e.target.value)}
              placeholder={t('jobs.benefitsPlaceholder')}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>{t('jobs.timeline')}</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>{t('jobs.startDate')}</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t('jobs.endDate')}</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('jobs.applicationDeadline')}</label>
            <input
              type="date"
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
            <label>{t('jobs.projectDetails')}</label>
            <textarea
              value={formData.projectDetails}
              onChange={(e) => handleInputChange('projectDetails', e.target.value)}
              placeholder={t('jobs.projectDetailsPlaceholder')}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>{t('jobs.tags')}</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => handleArrayChange('tags', e.target.value)}
              placeholder={t('jobs.tagsPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('jobs.additionalInfo')}</label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder={t('jobs.additionalInfoPlaceholder')}
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            <FiX />
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <FiSave />
            {loading ? t('common.creating') : t('jobs.createJob')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
