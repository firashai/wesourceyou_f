import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiUser, FiMail, FiLock, FiMapPin, FiPhone, FiCalendar, FiBriefcase, FiFileText, FiLink, FiCamera, FiGlobe } from 'react-icons/fi';
import './Auth.css';

const RegisterJournalist = () => {
  const navigate = useNavigate();
  const { registerJournalist } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm();

  const mediaWorkTypes = [
    'Producer', 'Reporter', 'TV Cameraman', 'Photographer', 
    'Video Editor', 'Trainer', 'Graphic Designer', 'Lawyer', 
    'Voice-over artist', 'Translator', 'Analyst'
  ];

  const analystSpecialties = [
    'Political', 'Economic', 'Social', 'Cultural', 'Sports', 
    'Technology', 'Health', 'Environment', 'International Relations', 'Other'
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await registerJournalist(data);
      if (!result.success) {
        setError('root', {
          type: 'manual',
          message: result.error,
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{t('register.journalist.title')}</h1>
          <p>{t('register.journalist.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiUser />
              {t('register.personalInfo')}
            </h3>
            
            <div className="form-group">
              <label className="form-label required">{t('form.fullName')}</label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                {...register('name', { required: t('form.fullName') + ' is required' })}
                placeholder={t('form.fullName')}
              />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label required">{t('form.email')}</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                {...register('email', { 
                  required: t('form.email') + ' is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder={t('form.email')}
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">{t('form.password')}</label>
                <input
                  type="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  {...register('password', { 
                    required: t('form.password') + ' is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  placeholder={t('form.password')}
                />
                {errors.password && <span className="error-message">{errors.password.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">{t('form.confirmPassword')}</label>
                <input
                  type="password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === watch('password') || 'Passwords do not match'
                  })}
                  placeholder={t('form.confirmPassword')}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
              </div>
            </div>
          </div>

          {/* Location & Contact Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiMapPin />
              {t('register.locationContact')}
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">{t('form.country')}</label>
                <input
                  type="text"
                  className={`form-input ${errors.country ? 'error' : ''}`}
                  {...register('country', { required: t('form.country') + ' is required' })}
                  placeholder={t('form.country')}
                />
                {errors.country && <span className="error-message">{errors.country.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">{t('form.city')}</label>
                <input
                  type="text"
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  {...register('city', { required: t('form.city') + ' is required' })}
                  placeholder={t('form.city')}
                />
                {errors.city && <span className="error-message">{errors.city.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">{t('form.phoneNumber')}</label>
              <input
                type="tel"
                className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                {...register('phoneNumber', { required: t('form.phoneNumber') + ' is required' })}
                placeholder={t('form.phoneNumber')}
              />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber.message}</span>}
            </div>
          </div>

          {/* Professional Background Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiBriefcase />
              {t('register.professionalBackground')}
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">{t('form.dateOfBirth')}</label>
                <input
                  type="date"
                  className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                  {...register('dateOfBirth', { required: t('form.dateOfBirth') + ' is required' })}
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">{t('form.mediaWorkStartDate')}</label>
                <input
                  type="date"
                  className={`form-input ${errors.mediaWorkStartDate ? 'error' : ''}`}
                  {...register('mediaWorkStartDate', { required: t('form.mediaWorkStartDate') + ' is required' })}
                />
                {errors.mediaWorkStartDate && <span className="error-message">{errors.mediaWorkStartDate.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">{t('form.mediaWorkType')}</label>
              <select 
                className={`form-select ${errors.mediaWorkType ? 'error' : ''}`}
                {...register('mediaWorkType', { required: t('form.mediaWorkType') + ' is required' })}
              >
                <option value="">{t('form.mediaWorkType')}</option>
                {mediaWorkTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.mediaWorkType && <span className="error-message">{errors.mediaWorkType.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('form.analystSpecialty')}</label>
              <select className="form-select" {...register('analystSpecialty')}>
                <option value="">{t('form.analystSpecialty')}</option>
                {analystSpecialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills & Experience Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiFileText />
              {t('register.skillsExperience')}
            </h3>
            
            <div className="form-group">
              <label className="form-label">{t('form.bio')}</label>
              <textarea
                className="form-textarea"
                {...register('bio')}
                placeholder={t('form.bio')}
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('form.skills')}</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('skills')}
                  placeholder="e.g., Photojournalism, Video Editing, Interviewing"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('form.languages')}</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('languages')}
                  placeholder="e.g., English, Spanish, French"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('form.previousWorkLinks')}</label>
              <textarea
                className="form-textarea"
                {...register('previousWorkLinks')}
                placeholder="https://example.com/portfolio1&#10;https://example.com/portfolio2"
                rows="3"
              />
            </div>
          </div>

          {/* Social Media Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiLink />
              {t('register.socialMedia')}
            </h3>
            
            <div className="social-media-inputs">
              <div className="form-group">
                <label className="form-label">Facebook URL</label>
                <input
                  type="url"
                  className="form-input"
                  {...register('socialMedia.facebook')}
                  placeholder="https://facebook.com/yourprofile"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter URL</label>
                <input
                  type="url"
                  className="form-input"
                  {...register('socialMedia.twitter')}
                  placeholder="https://twitter.com/yourprofile"
                />
              </div>
              <div className="form-group">
                <label className="form-label">YouTube URL</label>
                <input
                  type="url"
                  className="form-input"
                  {...register('socialMedia.youtube')}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Other Social Media</label>
                <input
                  type="url"
                  className="form-input"
                  {...register('socialMedia.other')}
                  placeholder="https://other-platform.com/yourprofile"
                />
              </div>
            </div>
          </div>

          {/* Equipment Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiCamera />
              {t('register.equipment')}
            </h3>
            
            <div className="equipment-inputs">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  {...register('hasCamera')}
                  id="hasCamera"
                />
                <label htmlFor="hasCamera">{t('form.hasCamera')}</label>
              </div>
              
              {watch('hasCamera') && (
                <div className="equipment-detail">
                  <label className="form-label">{t('form.cameraType')}</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('cameraType')}
                    placeholder="e.g., Canon EOS R5, Sony A7III"
                  />
                </div>
              )}
              
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  {...register('hasAudioEquipment')}
                  id="hasAudioEquipment"
                />
                <label htmlFor="hasAudioEquipment">{t('form.hasAudioEquipment')}</label>
              </div>
              
              {watch('hasAudioEquipment') && (
                <div className="equipment-detail">
                  <label className="form-label">{t('form.audioEquipmentType')}</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('audioEquipmentType')}
                    placeholder="e.g., Rode NTG5, Zoom H6"
                  />
                </div>
              )}
              
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  {...register('canTravel')}
                  id="canTravel"
                />
                <label htmlFor="canTravel">{t('form.canTravel')}</label>
              </div>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('auth.createAccount')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {t('auth.hasAccount')} <Link to="/login">{t('auth.signIn')}</Link>
          </p>
          <p>
            <Link to="/register">← {t('common.back')} to registration options</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterJournalist;
