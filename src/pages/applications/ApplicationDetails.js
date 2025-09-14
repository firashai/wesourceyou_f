import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiArrowLeft, FiUser, FiBriefcase, FiCalendar, FiMapPin, FiDollarSign, FiFileText, FiMail, FiPhone, FiGlobe, FiDownload } from 'react-icons/fi';
import './ApplicationDetails.css';

const ApplicationDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/companies/my/applications/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplication(data);
      } else {
        const errorText = await response.text();
        console.error('Application details response error:', errorText);
        setError(t('applications.fetchError', { status: response.status, statusText: response.statusText }));
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      setError(t('applications.error', { message: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'reviewing': return 'reviewing';
      case 'shortlisted': return 'shortlisted';
      case 'interviewed': return 'interviewed';
      case 'accepted': return 'accepted';
      case 'rejected': return 'rejected';
      case 'withdrawn': return 'withdrawn';
      default: return 'pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return t('applications.status.pending');
      case 'reviewing': return t('applications.status.reviewing');
      case 'shortlisted': return t('applications.status.shortlisted');
      case 'interviewed': return t('applications.status.interviewed');
      case 'accepted': return t('applications.status.accepted');
      case 'rejected': return t('applications.status.rejected');
      case 'withdrawn': return t('applications.status.withdrawn');
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return t('applications.notSpecified');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const handleBack = () => {
    navigate('/applications');
  };

  const handleViewJob = () => {
    navigate(`/jobs/${application.job.id}`);
  };

  const handleViewJournalist = () => {
    navigate(`/journalists/${application.journalist.id}`);
  };

  if (loading) {
    return (
      <div className="application-details-container">
        <div className="loading">{t('common.loading')}</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="application-details-container">
        <div className="error">{error || t('applications.notFound')}</div>
      </div>
    );
  }

  return (
    <div className="application-details-container">
      <div className="application-details-header">
        <button className="back-button" onClick={handleBack}>
          <FiArrowLeft />
          {t('common.back')}
        </button>
        <h1>{t('applications.details.title')}</h1>
      </div>

      <div className="application-details-content">
        {/* Application Status */}
        <div className="status-section">
          <div className={`status-badge ${getStatusColor(application.status)}`}>
            {getStatusText(application.status)}
          </div>
          <div className="application-date">
            <FiCalendar />
            {t('applications.appliedOn')}: {formatDate(application.createdAt)}
          </div>
        </div>

        {/* Job Information */}
        <div className="section">
          <h2>{t('applications.jobInformation')}</h2>
          <div className="job-card" onClick={handleViewJob}>
            <div className="job-header">
              <h3>{application.job.title}</h3>
              <span className="company-name">{application.job.company.name}</span>
            </div>
            <div className="job-meta">
              <div className="meta-item">
                <FiMapPin />
                <span>{application.job.location || t('applications.locationNotSpecified')}</span>
              </div>
              <div className="meta-item">
                <FiDollarSign />
                <span>{application.job.salary ? formatCurrency(application.job.salary, application.job.salaryCurrency) : t('applications.notSpecified')}</span>
              </div>
            </div>
            <div className="job-description">
              {application.job.description.substring(0, 200)}...
            </div>
          </div>
        </div>

        {/* Applicant Information */}
        <div className="section">
          <h2>{t('applications.applicantInformation')}</h2>
          <div className="applicant-card" onClick={handleViewJournalist}>
            <div className="applicant-header">
              <div className="applicant-avatar">
                <FiUser />
              </div>
              <div className="applicant-info">
                <h3>{application.journalist.user.firstName} {application.journalist.user.lastName}</h3>
                <p className="applicant-email">
                  <FiMail />
                  {application.journalist.user.email}
                </p>
                {application.journalist.phone && (
                  <p className="applicant-phone">
                    <FiPhone />
                    {application.journalist.phone}
                  </p>
                )}
                {application.journalist.website && (
                  <p className="applicant-website">
                    <FiGlobe />
                    <a href={application.journalist.website} target="_blank" rel="noopener noreferrer">
                      {application.journalist.website}
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div className="applicant-details">
              {application.journalist.bio && (
                <div className="detail-item">
                  <h4>{t('applications.bio')}</h4>
                  <p>{application.journalist.bio}</p>
                </div>
              )}
              {application.journalist.experience && (
                <div className="detail-item">
                  <h4>{t('applications.experience')}</h4>
                  <p>{application.journalist.experience}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="section">
          <h2>{t('applications.applicationDetails')}</h2>
          
          {/* Cover Letter */}
          <div className="detail-section">
            <h3>{t('applications.coverLetter')}</h3>
            <div className="cover-letter">
              <FiFileText />
              <p>{application.coverLetter}</p>
            </div>
          </div>

          {/* Proposed Rate */}
          {application.proposedRate && (
            <div className="detail-section">
              <h3>{t('applications.proposedRate')}</h3>
              <div className="rate-info">
                <FiDollarSign />
                <span>{formatCurrency(application.proposedRate, application.proposedRateCurrency)}</span>
                {application.proposedRatePeriod && (
                  <span className="rate-period"> / {application.proposedRatePeriod}</span>
                )}
              </div>
            </div>
          )}

          {/* Available Start Date */}
          {application.availableStartDate && (
            <div className="detail-section">
              <h3>{t('applications.availableStartDate')}</h3>
              <div className="date-info">
                <FiCalendar />
                <span>{formatDate(application.availableStartDate)}</span>
              </div>
            </div>
          )}

          {/* Availability */}
          {application.availability && (
            <div className="detail-section">
              <h3>{t('applications.availability')}</h3>
              <p>{application.availability}</p>
            </div>
          )}

          {/* Skills */}
          {application.skills && (
            <div className="detail-section">
              <h3>{t('applications.skills')}</h3>
              <p>{application.skills}</p>
            </div>
          )}

          {/* Languages */}
          {application.languages && (
            <div className="detail-section">
              <h3>{t('applications.languages')}</h3>
              <p>{application.languages}</p>
            </div>
          )}

          {/* Equipment */}
          {application.equipment && (
            <div className="detail-section">
              <h3>{t('applications.equipment')}</h3>
              <p>{application.equipment}</p>
            </div>
          )}

          {/* Experience */}
          {application.experience && (
            <div className="detail-section">
              <h3>{t('applications.experience')}</h3>
              <p>{application.experience}</p>
            </div>
          )}

          {/* Education */}
          {application.education && (
            <div className="detail-section">
              <h3>{t('applications.education')}</h3>
              <p>{application.education}</p>
            </div>
          )}

          {/* Portfolio */}
          {application.portfolio && (
            <div className="detail-section">
              <h3>{t('applications.portfolio')}</h3>
              <div className="portfolio-link">
                <FiGlobe />
                <a href={application.portfolio} target="_blank" rel="noopener noreferrer">
                  {t('applications.viewPortfolio')}
                </a>
              </div>
            </div>
          )}

          {/* Samples */}
          {application.samples && (
            <div className="detail-section">
              <h3>{t('applications.samples')}</h3>
              <p>{application.samples}</p>
            </div>
          )}

          {/* References */}
          {application.references && (
            <div className="detail-section">
              <h3>{t('applications.references')}</h3>
              <p>{application.references}</p>
            </div>
          )}

          {/* Additional Info */}
          {application.additionalInfo && (
            <div className="detail-section">
              <h3>{t('applications.additionalInfo')}</h3>
              <p>{application.additionalInfo}</p>
            </div>
          )}

          {/* Resume */}
          {application.resumeUrl && (
            <div className="detail-section">
              <h3>{t('applications.resume')}</h3>
              <div className="resume-download">
                <FiDownload />
                <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                  {application.resumeFilename || t('applications.downloadResume')}
                </a>
                {application.resumeSize && (
                  <span className="file-size">({(application.resumeSize / 1024 / 1024).toFixed(2)} MB)</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;

