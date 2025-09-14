import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiHome, FiUser, FiMail, FiLock, FiMapPin, FiPhone, FiGlobe, FiFileText, FiLink, FiUsers, FiDollarSign } from 'react-icons/fi';
import './Auth.css';

const RegisterCompany = () => {
  const navigate = useNavigate();
  const { registerCompany } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm();

  const requiredServices = [
    'Producer', 'Reporter', 'TV Cameraman', 'Photographer', 
    'Video Editor', 'Trainer', 'Graphic Designer', 'Lawyer', 
    'Voice-over artist', 'Translator', 'Analyst'
  ];

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await registerCompany(data);
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
          <h1>{t('register.company.title')}</h1>
          <p>{t('register.company.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {/* Company Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiHome />
              {t('register.companyInfo')}
            </h3>
            
            <div className="form-group">
              <label className="form-label required">{t('form.companyName')}</label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                {...register('name', { required: t('form.companyName') + ' is required' })}
                placeholder={t('form.companyName')}
              />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('form.website')}</label>
              <input
                type="url"
                className="form-input"
                {...register('website')}
                placeholder="https://yourcompany.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label required">{t('form.companySize')}</label>
              <select 
                className={`form-select ${errors.companySize ? 'error' : ''}`}
                {...register('companySize', { required: t('form.companySize') + ' is required' })}
              >
                <option value="">{t('form.companySize')}</option>
                {companySizes.map(size => (
                  <option key={size} value={size}>{size} employees</option>
                ))}
              </select>
              {errors.companySize && <span className="error-message">{errors.companySize.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('form.industry')}</label>
              <input
                type="text"
                className="form-input"
                {...register('industry')}
                placeholder="e.g., News, Entertainment, Documentary"
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiUser />
              {t('register.contactInfo')}
            </h3>
            
            <div className="form-group">
              <label className="form-label required">{t('form.contactPersonName')}</label>
              <input
                type="text"
                className={`form-input ${errors.contactName ? 'error' : ''}`}
                {...register('contactName', { required: t('form.contactPersonName') + ' is required' })}
                placeholder={t('form.contactPersonName')}
              />
              {errors.contactName && <span className="error-message">{errors.contactName.message}</span>}
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

          {/* Company Description Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiFileText />
              {t('register.companyDescription')}
            </h3>
            
            <div className="form-group">
              <label className="form-label required">{t('form.companyDescription')}</label>
              <textarea
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                {...register('description', { required: t('form.companyDescription') + ' is required' })}
                placeholder="Tell us about your company and what you do"
                rows="4"
              />
              {errors.description && <span className="error-message">{errors.description.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('form.missionStatement')}</label>
              <textarea
                className="form-textarea"
                {...register('mission')}
                placeholder="Your company's mission statement"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('form.visionStatement')}</label>
              <textarea
                className="form-textarea"
                {...register('vision')}
                placeholder="Your company's vision statement"
                rows="3"
              />
            </div>
          </div>

          {/* Services & Requirements Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiUsers />
              {t('register.servicesRequirements')}
            </h3>
            
            <div className="form-group">
              <label className="form-label required">{t('form.requiredServices')}</label>
              <div className="services-selection">
                {requiredServices.map(service => (
                  <div key={service} className="service-checkbox">
                    <input
                      type="checkbox"
                      {...register('requiredServices')}
                      value={service}
                      id={service}
                    />
                    <label htmlFor={service}>{service}</label>
                  </div>
                ))}
              </div>
              {errors.requiredServices && <span className="error-message">Please select at least one service</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('form.locations')}</label>
              <input
                type="text"
                className="form-input"
                {...register('locations')}
                placeholder="e.g., New York, Los Angeles, London"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('form.paymentMethods')}</label>
              <input
                type="text"
                className="form-input"
                {...register('paymentMethods')}
                placeholder="e.g., Credit Card, Bank Transfer, PayPal"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('form.preferredCommunication')}</label>
              <select className="form-select" {...register('preferredCommunication')}>
                <option value="">Select preferred communication method</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Video Call">Video Call</option>
                <option value="In Person">In Person</option>
              </select>
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
                  placeholder="https://facebook.com/yourcompany"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter URL</label>
                <input
                  type="url"
                  className="form-input"
                  {...register('socialMedia.twitter')}
                  placeholder="https://twitter.com/yourcompany"
                />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="url"
                  className="form-input"
                  {...register('socialMedia.linkedin')}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Other Social Media</label>
                <input
                  type="url"
                  className="form-input"
                  {...register('socialMedia.other')}
                  placeholder="https://other-platform.com/yourcompany"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <FiDollarSign />
              {t('register.additionalInfo')}
            </h3>
            
            <div className="form-group">
              <label className="form-label">{t('form.contactPersons')}</label>
              <textarea
                className="form-textarea"
                {...register('contactPersons')}
                placeholder='[{"name": "John Doe", "position": "HR Manager", "email": "john@company.com", "phone": "+1234567890"}]'
                rows="3"
              />
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

export default RegisterCompany;
