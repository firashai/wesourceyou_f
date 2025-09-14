import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiCheck, FiX, FiClock, FiDollarSign } from 'react-icons/fi';
import MediaUpload from './MediaUpload';
import './UserMediaManager.css';

const UserMediaManager = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [myMedia, setMyMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);

  useEffect(() => {
    fetchMyMedia();
  }, []);

  const fetchMyMedia = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/media-content/my/content', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched media data:', data);
        
        // Log each media item's fileUrl and thumbnailUrl for debugging
        data.forEach((media, index) => {
          console.log(`Media ${index + 1}:`, {
            id: media.id,
            title: media.title,
            fileUrl: media.fileUrl,
            hasFileUrl: !!media.fileUrl,
            fileUrlType: typeof media.fileUrl,
            thumbnailUrl: media.thumbnailUrl,
            hasThumbnailUrl: !!media.thumbnailUrl,
            thumbnailUrlType: typeof media.thumbnailUrl,
            mediaType: media.mediaType
          });
        });
        
        setMyMedia(data);
      } else {
        console.error('Failed to fetch media content:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching media content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newMedia) => {
    setMyMedia(prev => [newMedia, ...prev]);
    setShowUploadModal(false);
  };

  const handleViewMedia = (media) => {
    console.log('Viewing media:', media);
    console.log('File URL:', media.fileUrl);
    
    // Check if fileUrl exists and is valid
    if (media.fileUrl && media.fileUrl !== 'undefined' && media.fileUrl !== 'null') {
      // If it's a relative path, construct the full URL
      let fullUrl = media.fileUrl;
      if (media.fileUrl.startsWith('/')) {
        fullUrl = `http://localhost:3001${media.fileUrl}`;
      } else if (!media.fileUrl.startsWith('http')) {
        fullUrl = `http://localhost:3001/uploads/${media.fileUrl}`;
      }
      
      console.log('Opening URL:', fullUrl);
      window.open(fullUrl, '_blank');
    } else {
      console.error('No valid file URL found for media:', media);
      alert(t('media.view.noFile'));
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm(t('media.delete.confirm'))) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/media-content/my/${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMyMedia(prev => prev.filter(media => media.id !== mediaId));
      } else {
        alert(t('media.delete.error'));
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      alert(t('media.delete.error'));
    }
  };

  const getStatusBadge = (status, isApproved) => {
    if (!isApproved) {
      return (
        <span className="status-badge pending">
          <FiClock />
          {t('media.status.pending')}
        </span>
      );
    }

    switch (status) {
      case 'published':
        return (
          <span className="status-badge approved">
            <FiCheck />
            {t('media.status.published')}
          </span>
        );
      case 'draft':
        return (
          <span className="status-badge draft">
            {t('media.status.draft')}
          </span>
        );
      case 'sold':
        return (
          <span className="status-badge sold">
            {t('media.status.sold')}
          </span>
        );
      default:
        return (
          <span className="status-badge unknown">
            {status}
          </span>
        );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="user-media-manager">
        <div className="loading">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="user-media-manager">
      <div className="media-manager-header">
        <div className="header-content">
          <h1>{t('media.myContent.title')}</h1>
          <p>{t('media.myContent.subtitle')}</p>
        </div>
        <button 
          className="upload-button"
          onClick={() => setShowUploadModal(true)}
        >
          <FiPlus />
          {t('media.upload.new')}
        </button>
      </div>

      <div className="media-stats">
        <div className="stat-card">
          <h3>{t('media.stats.total')}</h3>
          <p className="stat-number">{myMedia.length}</p>
        </div>
        <div className="stat-card">
          <h3>{t('media.stats.published')}</h3>
          <p className="stat-number">
            {myMedia.filter(media => media.status === 'published' && media.isApproved).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>{t('media.stats.pending')}</h3>
          <p className="stat-number">
            {myMedia.filter(media => !media.isApproved).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>{t('media.stats.revenue')}</h3>
          <p className="stat-number">
            {formatPrice(myMedia.reduce((total, media) => total + (media.totalRevenue || 0), 0))}
          </p>
        </div>
      </div>

      {myMedia.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>{t('media.myContent.empty.title')}</h3>
          <p>{t('media.myContent.empty.description')}</p>
          <button 
            className="upload-button"
            onClick={() => setShowUploadModal(true)}
          >
            <FiPlus />
            {t('media.upload.first')}
          </button>
        </div>
      ) : (
        <div className="media-grid">
          {myMedia.map(media => (
            <div key={media.id} className="media-card">
              <div className="media-preview">
                {media.thumbnailUrl ? (
                  <img 
                    src={media.thumbnailUrl.startsWith('http') ? media.thumbnailUrl : `http://localhost:3001${media.thumbnailUrl}`} 
                    alt={media.title || 'Media'} 
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="media-placeholder" style={{ display: media.thumbnailUrl ? 'none' : 'flex' }}>
                  {media.mediaType === 'video' ? '🎥' : 
                   media.mediaType === 'photo' ? '📷' : 
                   media.mediaType === 'audio' ? '🎵' : 
                   media.mediaType === 'document' ? '📄' :
                   media.mediaType === 'footage' ? '🎬' : '📁'}
                </div>
                <div className="media-overlay">
                  <div className="media-actions">
                    <button 
                      className="action-button view"
                      title={t('common.view')}
                      onClick={() => handleViewMedia(media)}
                    >
                      <FiEye />
                    </button>
                    <button 
                      className="action-button edit"
                      title={t('common.edit')}
                      onClick={() => setEditingMedia(media)}
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className="action-button delete"
                      title={t('common.delete')}
                      onClick={() => handleDeleteMedia(media.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>

              <div className="media-info">
                <div className="media-header">
                  <h3 className="media-title">{media.title || 'Untitled'}</h3>
                  {getStatusBadge(media.status, media.isApproved)}
                </div>

                <p className="media-description">
                  {media.description ? 
                    (media.description.length > 100 
                      ? `${media.description.substring(0, 100)}...` 
                      : media.description)
                    : 'No description available'
                  }
                </p>

                <div className="media-meta">
                  <span className="media-type">{media.mediaType || 'Unknown'}</span>
                  <span className="media-license">{media.licenseType || 'Standard'}</span>
                </div>

                <div className="media-stats-row">
                  <div className="stat-item">
                    <FiEye />
                    <span>{media.totalViews || 0}</span>
                  </div>
                  <div className="stat-item">
                    <FiDollarSign />
                    <span>{formatPrice(media.price || 0)}</span>
                  </div>
                </div>

                <div className="media-footer">
                  <span className="upload-date">
                    {t('media.uploaded')} {formatDate(media.createdAt || new Date())}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <MediaUpload
          onUpload={handleUploadSuccess}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {editingMedia && (
        <MediaUpload
          onUpload={(updatedMedia) => {
            setMyMedia(prev => prev.map(media => 
              media.id === updatedMedia.id ? updatedMedia : media
            ));
            setEditingMedia(null);
          }}
          onClose={() => setEditingMedia(null)}
          editData={editingMedia}
        />
      )}
    </div>
  );
};

export default UserMediaManager;
