import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiX, FiSave, FiUser, FiHome, FiBriefcase, FiVideo } from 'react-icons/fi';
import MultiSelectField from './MultiSelectField';
import './EditDialog.css';

const EditDialog = ({ 
  isOpen, 
  onClose, 
  onSave, 
  data, 
  type, 
  title 
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle boolean fields
    if (name === 'hasCamera' || name === 'hasAudioEquipment' || name === 'canTravel' || name === 'isAvailable') {
      setFormData(prev => ({
        ...prev,
        [name]: value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'journalist':
        return <FiUser />;
      case 'company':
        return <FiHome />;
      case 'job':
        return <FiBriefcase />;
      case 'media':
        return <FiVideo />;
      default:
        return <FiUser />;
    }
  };

  const renderJournalistForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t('admin.journalists.firstName')}</label>
        <input
          type="text"
          name="firstName"
          value={formData.user?.firstName || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            user: { ...prev.user, firstName: e.target.value }
          }))}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.lastName')}</label>
        <input
          type="text"
          name="lastName"
          value={formData.user?.lastName || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            user: { ...prev.user, lastName: e.target.value }
          }))}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.email')}</label>
        <input
          type="email"
          name="email"
          value={formData.user?.email || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            user: { ...prev.user, email: e.target.value }
          }))}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.phone')}</label>
        <input
          type="tel"
          name="phone"
          value={formData.user?.phone || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            user: { ...prev.user, phone: e.target.value }
          }))}
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.city')}</label>
        <input
          type="text"
          name="city"
          value={formData.user?.city || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            user: { ...prev.user, city: e.target.value }
          }))}
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.country')}</label>
        <input
          type="text"
          name="country"
          value={formData.user?.country || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            user: { ...prev.user, country: e.target.value }
          }))}
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.specialty')}</label>
        <select
          name="mediaWorkType"
          value={formData.mediaWorkType || ''}
          onChange={handleInputChange}
        >
          <option value="">{t('common.select')}</option>
          <option value="video_production">Video Production</option>
          <option value="photo_journalism">Photo Journalism</option>
          <option value="written_content">Written Content</option>
          <option value="audio_production">Audio Production</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.experience')}</label>
        <select
          name="experienceLevel"
          value={formData.experienceLevel || ''}
          onChange={handleInputChange}
        >
          <option value="">{t('common.select')}</option>
          <option value="junior">Junior</option>
          <option value="mid_level">Mid Level</option>
          <option value="senior">Senior</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.analystSpecialty')}</label>
        <select
          name="analystSpecialty"
          value={formData.analystSpecialty || ''}
          onChange={handleInputChange}
        >
          <option value="">{t('common.select')}</option>
          <option value="arabic_affairs">Arabic Affairs</option>
          <option value="kurdish_affairs">Kurdish Affairs</option>
          <option value="persian_affairs">Persian Affairs</option>
          <option value="middle_eastern_affairs">Middle Eastern Affairs</option>
          <option value="european_affairs">European Affairs</option>
          <option value="american_affairs">American Affairs</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.hasCamera')}</label>
        <select
          name="hasCamera"
          value={formData.hasCamera || false}
          onChange={handleInputChange}
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.cameraType')}</label>
        <input
          type="text"
          name="cameraType"
          value={formData.cameraType || ''}
          onChange={handleInputChange}
          placeholder="e.g., Sony FX6, Canon EOS R5"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.hasAudioEquipment')}</label>
        <select
          name="hasAudioEquipment"
          value={formData.hasAudioEquipment || false}
          onChange={handleInputChange}
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.audioEquipmentType')}</label>
        <input
          type="text"
          name="audioEquipmentType"
          value={formData.audioEquipmentType || ''}
          onChange={handleInputChange}
          placeholder="e.g., Sennheiser MKH416, Rode NTG5"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.canTravel')}</label>
        <select
          name="canTravel"
          value={formData.canTravel || false}
          onChange={handleInputChange}
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.isAvailable')}</label>
        <select
          name="isAvailable"
          value={formData.isAvailable || true}
          onChange={handleInputChange}
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.hourlyRate')}</label>
        <input
          type="number"
          name="hourlyRate"
          value={formData.hourlyRate || ''}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          placeholder="e.g., 75.00"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.dailyRate')}</label>
        <input
          type="number"
          name="dailyRate"
          value={formData.dailyRate || ''}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          placeholder="e.g., 600.00"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.projectRate')}</label>
        <input
          type="number"
          name="projectRate"
          value={formData.projectRate || ''}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          placeholder="e.g., 2500.00"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.rating')}</label>
        <input
          type="number"
          name="rating"
          value={formData.rating || ''}
          onChange={handleInputChange}
          min="0"
          max="5"
          step="0.01"
          placeholder="e.g., 4.8"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.totalReviews')}</label>
        <input
          type="number"
          name="totalReviews"
          value={formData.totalReviews || ''}
          onChange={handleInputChange}
          min="0"
          placeholder="e.g., 45"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.completedProjects')}</label>
        <input
          type="number"
          name="completedProjects"
          value={formData.completedProjects || ''}
          onChange={handleInputChange}
          min="0"
          placeholder="e.g., 32"
        />
      </div>
      <MultiSelectField
        label={t('admin.journalists.skills')}
        value={Array.isArray(formData.skills) ? formData.skills : []}
        onChange={(skills) => setFormData(prev => ({ ...prev, skills }))}
        options={[
          'Video Production',
          'Photo Journalism',
          'Conflict Reporting',
          'Political Analysis',
          'Live Broadcasting',
          'Video Editing',
          'Audio Production',
          'Interviewing',
          'Research',
          'Translation',
          'Graphic Design',
          'Social Media Management',
          'Drone Operation',
          'First Aid',
          'Satellite Communication'
        ]}
        placeholder="Type to add custom skill..."
        maxItems={15}
      />
      <MultiSelectField
        label={t('admin.journalists.languages')}
        value={Array.isArray(formData.languages) ? formData.languages : []}
        onChange={(languages) => setFormData(prev => ({ ...prev, languages }))}
        options={[
          'English',
          'Arabic',
          'French',
          'Spanish',
          'German',
          'Italian',
          'Portuguese',
          'Russian',
          'Chinese',
          'Japanese',
          'Korean',
          'Turkish',
          'Persian',
          'Kurdish',
          'Hebrew',
          'Hindi',
          'Urdu',
          'Bengali',
          'Thai',
          'Vietnamese'
        ]}
        placeholder="Type to add custom language..."
        maxItems={10}
      />
      <MultiSelectField
        label={t('admin.journalists.certifications')}
        value={Array.isArray(formData.certifications) ? formData.certifications : []}
        onChange={(certifications) => setFormData(prev => ({ ...prev, certifications }))}
        options={[
          'War Correspondent Certification',
          'First Aid Training',
          'Hostile Environment Training',
          'Satellite Communication Certification',
          'Drone Operation License',
          'Press Accreditation',
          'Media Ethics Certification',
          'Digital Security Training',
          'Conflict Resolution Training',
          'Cultural Sensitivity Training',
          'Emergency Response Certification',
          'Broadcast Journalism Certificate',
          'Photojournalism Certification',
          'Video Production Certification',
          'Audio Engineering Certificate'
        ]}
        placeholder="Type to add custom certification..."
        maxItems={10}
      />
      <div className="form-group">
        <label>{t('admin.journalists.previousWorkLinks')}</label>
        <textarea
          name="previousWorkLinks"
          value={Array.isArray(formData.previousWorkLinks) ? formData.previousWorkLinks.join('\n') : ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            previousWorkLinks: e.target.value.split('\n').map(link => link.trim()).filter(link => link)
          }))}
          rows="3"
          placeholder="https://example.com/work1&#10;https://example.com/work2"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.journalists.bio')}</label>
        <textarea
          name="bio"
          value={formData.bio || ''}
          onChange={handleInputChange}
          rows="4"
          placeholder="Professional biography and experience summary"
        />
      </div>
    </form>
  );

  const renderCompanyForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t('admin.companies.name')}</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('admin.companies.email')}</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('admin.companies.phone')}</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>{t('admin.companies.website')}</label>
        <input
          type="url"
          name="website"
          value={formData.website || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>{t('admin.companies.industry')}</label>
        <input
          type="text"
          name="industry"
          value={formData.industry || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>{t('admin.companies.location')}</label>
        <input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>{t('admin.companies.description')}</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows="4"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.companies.size')}</label>
        <select
          name="companySize"
          value={formData.companySize || ''}
          onChange={handleInputChange}
        >
          <option value="">{t('common.select')}</option>
          <option value="startup">Startup</option>
          <option value="small">Small (1-50)</option>
          <option value="medium">Medium (51-200)</option>
          <option value="large">Large (200+)</option>
        </select>
      </div>
    </form>
  );

  const renderJobForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t('admin.jobs.title')}</label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('admin.jobs.description')}</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows="4"
          required
        />
      </div>
      <div className="form-group">
        <label>{t('admin.jobs.jobType')}</label>
        <select
          name="jobType"
          value={formData.jobType || ''}
          onChange={handleInputChange}
        >
          <option value="">{t('common.select')}</option>
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="freelance">Freelance</option>
          <option value="contract">Contract</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.jobs.mediaWorkType')}</label>
        <select
          name="mediaWorkType"
          value={formData.mediaWorkType || ''}
          onChange={handleInputChange}
        >
          <option value="">{t('common.select')}</option>
          <option value="video_production">Video Production</option>
          <option value="photo_journalism">Photo Journalism</option>
          <option value="written_content">Written Content</option>
          <option value="audio_production">Audio Production</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.jobs.experienceLevel')}</label>
        <select
          name="experienceLevel"
          value={formData.experienceLevel || ''}
          onChange={handleInputChange}
        >
          <option value="">{t('common.select')}</option>
          <option value="junior">Junior</option>
          <option value="mid_level">Mid Level</option>
          <option value="senior">Senior</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.jobs.salary')}</label>
        <input
          type="text"
          name="salary"
          value={formData.salary || ''}
          onChange={handleInputChange}
          placeholder="e.g., $50,000 - $70,000"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.jobs.location')}</label>
        <input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>{t('admin.jobs.status')}</label>
        <select
          name="status"
          value={formData.status || ''}
          onChange={handleInputChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </form>
  );

  const renderMediaForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t('admin.media.title')}</label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('admin.media.description')}</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows="4"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.media.type')}</label>
        <select
          name="type"
          value={formData.type || ''}
          onChange={handleInputChange}
        >
          <option value="">{t('common.select')}</option>
          <option value="video">Video</option>
          <option value="photo">Photo</option>
          <option value="audio">Audio</option>
          <option value="article">Article</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t('admin.media.category')}</label>
        <input
          type="text"
          name="category"
          value={formData.category || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>{t('admin.media.price')}</label>
        <input
          type="number"
          name="price"
          value={formData.price || ''}
          onChange={handleInputChange}
          min="0"
          step="0.01"
        />
      </div>
      <div className="form-group">
        <label>{t('admin.media.status')}</label>
        <select
          name="status"
          value={formData.status || ''}
          onChange={handleInputChange}
        >
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </form>
  );

  const renderForm = () => {
    switch (type) {
      case 'journalist':
        return renderJournalistForm();
      case 'company':
        return renderCompanyForm();
      case 'job':
        return renderJobForm();
      case 'media':
        return renderMediaForm();
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-dialog-overlay">
      <div className="edit-dialog">
        <div className="edit-dialog-header">
          <div className="edit-dialog-title">
            {getIcon()}
            <h3>{title}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="edit-dialog-content">
          {renderForm()}
        </div>
        
        <div className="edit-dialog-actions">
          <button className="cancel-btn" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button 
            className="save-btn" 
            onClick={handleSubmit}
            disabled={loading}
          >
            <FiSave />
            {loading ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDialog;
