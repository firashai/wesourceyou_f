import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiUpload, FiX, FiSave, FiFile, FiDollarSign, FiTag, FiMapPin, FiCalendar } from 'react-icons/fi';
import './MediaUpload.css';

const MediaUpload = ({ onUpload, onClose, editData = null }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'video',
    price: 0,
    licenseType: 'non_exclusive',
    tags: [],
    categories: [],
    location: '',
    duration: '',
    resolution: '',
    fileSize: '',
    usageRights: {
      allowedUses: [],
      restrictions: [],
      attribution: false
    }
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const isEditing = !!editData;

  // Populate form data when editing
  useEffect(() => {
    if (editData) {
      console.log('Edit data received:', editData);
      console.log('Usage rights from edit data:', editData.usageRights);
      
      setFormData({
        title: editData.title || '',
        description: editData.description || '',
        mediaType: editData.mediaType || 'video',
        price: editData.price || 0,
        licenseType: editData.licenseType || 'non_exclusive',
        tags: editData.tags || [],
        categories: editData.categories || [],
        location: editData.location || '',
        duration: editData.duration || '',
        resolution: editData.resolution || '',
        fileSize: editData.fileSize || '',
        usageRights: {
          allowedUses: Array.isArray(editData.usageRights?.allowedUses) ? editData.usageRights.allowedUses : [],
          restrictions: Array.isArray(editData.usageRights?.restrictions) ? editData.usageRights.restrictions : [],
          attribution: typeof editData.usageRights?.attribution === 'boolean' ? editData.usageRights.attribution : false
        }
      });
      
      // Set file preview if thumbnail exists
      if (editData.thumbnailUrl) {
        setFilePreview(editData.thumbnailUrl);
      }
    }
  }, [editData]);

  const mediaTypes = [
    { value: 'video', label: 'Video' },
    { value: 'photo', label: 'Photo' },
    { value: 'audio', label: 'Audio' },
    { value: 'document', label: 'Document' },
    { value: 'footage', label: 'Footage' }
  ];

  const licenseTypes = [
    { value: 'exclusive', label: 'Exclusive' },
    { value: 'non_exclusive', label: 'Non-Exclusive' },
    { value: 'limited_use', label: 'Limited Use' },
    { value: 'custom', label: 'Custom' }
  ];

  const allowedUsesOptions = [
    { value: 'commercial', label: 'Commercial Use' },
    { value: 'editorial', label: 'Editorial Use' },
    { value: 'personal', label: 'Personal Use' },
    { value: 'educational', label: 'Educational Use' },
    { value: 'advertising', label: 'Advertising' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'web_use', label: 'Web Use' },
    { value: 'print', label: 'Print' },
    { value: 'broadcast', label: 'Broadcast' }
  ];

  const restrictionsOptions = [
    { value: 'no_resale', label: 'No Resale' },
    { value: 'no_modification', label: 'No Modification' },
    { value: 'attribution_required', label: 'Attribution Required' },
    { value: 'no_commercial', label: 'No Commercial Use' },
    { value: 'no_derivatives', label: 'No Derivatives' },
    { value: 'territory_restricted', label: 'Territory Restricted' },
    { value: 'time_limited', label: 'Time Limited' },
    { value: 'usage_count_limited', label: 'Usage Count Limited' },
    { value: 'no_redistribution', label: 'No Redistribution' },
    { value: 'exclusive_use', label: 'Exclusive Use Only' }
  ];

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

  const handleMultiSelectChange = (field, selectedValues) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: selectedValues
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: selectedValues
      }));
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }

      // Auto-fill file size
      setFormData(prev => ({
        ...prev,
        fileSize: formatFileSize(file.size)
      }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For new uploads, require a file
    if (!isEditing && !selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setLoading(true);
    try {
      const uploadData = new FormData();
      
      // Only append file if it's a new upload or if a new file is selected
      if (selectedFile) {
        uploadData.append('file', selectedFile);
      }
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'usageRights') {
          uploadData.append(key, JSON.stringify(formData[key]));
        } else if (Array.isArray(formData[key])) {
          uploadData.append(key, JSON.stringify(formData[key]));
        } else {
          uploadData.append(key, formData[key]);
        }
      });

      // If editing and no new file selected, preserve the existing fileUrl
      if (isEditing && !selectedFile && editData.fileUrl) {
        uploadData.append('fileUrl', editData.fileUrl);
      }

      console.log('Form data being sent:', formData);
      console.log('Usage rights being sent:', formData.usageRights);

      const token = localStorage.getItem('token');
      const url = isEditing 
        ? `http://localhost:3001/media-content/my/${editData.id}`
        : 'http://localhost:3001/media-content/my/upload';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Update result:', result);
        onUpload(result);
        onClose();
      } else {
        const error = await response.json();
        console.error('Update error response:', error);
        alert(error.message || (isEditing ? 'Update failed' : 'Upload failed'));
      }
    } catch (error) {
      console.error(isEditing ? 'Update error:' : 'Upload error:', error);
      alert(isEditing ? 'Update failed' : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="media-upload-overlay">
      <div className="media-upload-modal">
        <div className="media-upload-header">
          <h2>{isEditing ? t('media.edit.title') : t('media.upload.title')}</h2>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="media-upload-form">
          <div className="form-section">
            <h3>{t('media.upload.fileSection')}</h3>
            
            <div className="file-upload-area">
              <input
                type="file"
                id="media-file"
                accept="video/*,image/*,audio/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="file-input"
              />
              <label htmlFor="media-file" className="file-label">
                <FiUpload />
                <span>
                  {selectedFile 
                    ? selectedFile.name 
                    : isEditing && editData.fileUrl 
                      ? `Current file: ${editData.fileUrl.split('/').pop()}`
                      : t('media.upload.selectFile')
                  }
                </span>
              </label>
              {isEditing && editData.fileUrl && !selectedFile && (
                <small style={{ marginTop: '8px', color: '#6b7280' }}>
                  {t('media.edit.keepExistingFile')}
                </small>
              )}
            </div>

            {filePreview && (
              <div className="file-preview">
                <img src={filePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>{t('media.upload.detailsSection')}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>{t('media.upload.title')} *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>{t('media.upload.type')} *</label>
                <select
                  value={formData.mediaType}
                  onChange={(e) => handleInputChange('mediaType', e.target.value)}
                  required
                >
                  {mediaTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>{t('media.upload.description')} *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('media.upload.price')} *</label>
                <div className="price-input">
                  <FiDollarSign />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>{t('media.upload.licenseType')} *</label>
                <select
                  value={formData.licenseType}
                  onChange={(e) => handleInputChange('licenseType', e.target.value)}
                  required
                >
                  {licenseTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>{t('media.upload.metadataSection')}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>{t('media.upload.location')}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder={t('media.upload.locationPlaceholder')}
                />
              </div>
              
              <div className="form-group">
                <label>{t('media.upload.duration')}</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 2:30"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('media.upload.resolution')}</label>
                <input
                  type="text"
                  value={formData.resolution}
                  onChange={(e) => handleInputChange('resolution', e.target.value)}
                  placeholder="e.g., 1920x1080"
                />
              </div>
              
              <div className="form-group">
                <label>{t('media.upload.fileSize')}</label>
                <input
                  type="text"
                  value={formData.fileSize}
                  onChange={(e) => handleInputChange('fileSize', e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('media.upload.tags')}</label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleArrayChange('tags', e.target.value)}
                placeholder={t('media.upload.tagsPlaceholder')}
              />
            </div>

            <div className="form-group">
              <label>{t('media.upload.categories')}</label>
              <input
                type="text"
                value={formData.categories.join(', ')}
                onChange={(e) => handleArrayChange('categories', e.target.value)}
                placeholder={t('media.upload.categoriesPlaceholder')}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>{t('media.upload.usageRightsSection')}</h3>
            
            <div className="form-group">
              <label>{t('media.upload.allowedUses')}</label>
              <select
                multiple
                value={formData.usageRights.allowedUses}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  handleMultiSelectChange('usageRights.allowedUses', selectedOptions);
                }}
                className="multi-select"
              >
                {allowedUsesOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <small>Hold Ctrl (or Cmd on Mac) to select multiple options</small>
            </div>

            <div className="form-group">
              <label>{t('media.upload.restrictions')}</label>
              <select
                multiple
                value={formData.usageRights.restrictions}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  handleMultiSelectChange('usageRights.restrictions', selectedOptions);
                }}
                className="multi-select"
              >
                {restrictionsOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <small>Hold Ctrl (or Cmd on Mac) to select multiple options</small>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.usageRights.attribution}
                  onChange={(e) => handleInputChange('usageRights.attribution', e.target.checked)}
                />
                {t('media.upload.requireAttribution')}
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading 
                ? (isEditing ? t('media.edit.updating') : t('media.upload.uploading')) 
                : (isEditing ? t('media.edit.update') : t('media.upload.upload'))
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediaUpload;
