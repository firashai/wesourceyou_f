import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import './MediaContent.css';

const MediaContent = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [mediaContent, setMediaContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredMedia, setFilteredMedia] = useState([]);

  const handleViewMedia = (media) => {
    console.log('Viewing media:', media);
    console.log('File URL:', media.fileUrl);
    
    // Check if fileUrl exists and is valid
    if (media.fileUrl && media.fileUrl !== 'undefined' && media.fileUrl !== 'null') {
      // If it's a relative path, construct the full URL
      let fullUrl = media.fileUrl;
      if (media.fileUrl.startsWith('/')) {
        fullUrl = `https://wesourceyoub2.vercel.app${media.fileUrl}`;
      } else if (!media.fileUrl.startsWith('http')) {
        fullUrl = `https://wesourceyoub2.vercel.app/uploads/${media.fileUrl}`;
      }
      
      console.log('Opening URL:', fullUrl);
      window.open(fullUrl, '_blank');
    } else {
      console.error('No valid file URL found for media:', media);
      alert('No file available for this media');
    }
  };

  useEffect(() => {
    const fetchMediaContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://wesourceyoub2.vercel.app/media-content');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched media content:', data);
        
        // Log each media item's thumbnail data for debugging
        data.forEach((media, index) => {
          console.log(`Media ${index + 1}:`, {
            id: media.id,
            title: media.title,
            fileUrl: media.fileUrl,
            thumbnailUrl: media.thumbnailUrl,
            hasThumbnailUrl: !!media.thumbnailUrl,
            mediaType: media.mediaType
          });
        });
        
        setMediaContent(data);
      } catch (error) {
        console.error('Error fetching media content:', error);
        setError('Failed to load media content');
      } finally {
        setLoading(false);
      }
    };

    fetchMediaContent();
  }, []);

  useEffect(() => {
    if (mediaContent.length > 0) {
      let filtered = [...mediaContent];
      
      // Filter by specific media if specified
      const mediaId = searchParams.get('mediaId');
      if (mediaId) {
        filtered = filtered.filter(media => media.id === parseInt(mediaId));
      }
      
      setFilteredMedia(filtered);
    }
  }, [mediaContent, searchParams]);

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="media-content-container">
      <div className="media-content-header">
        <h1>{t('media.title')}</h1>
        <p>{t('media.subtitle')}</p>
      </div>

      <div className="media-content-grid">
        {filteredMedia.length > 0 ? (
          filteredMedia.map(item => (
            <div key={item.id} className="media-card">
              <div className="media-preview" onClick={() => handleViewMedia(item)} style={{ cursor: 'pointer' }}>
                {item.thumbnailUrl ? (
                  <img 
                    src={item.thumbnailUrl.startsWith('http') ? item.thumbnailUrl : `https://wesourceyoub2.vercel.app${item.thumbnailUrl}`} 
                    alt={item.title || 'Media'} 
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="media-placeholder" style={{ display: item.thumbnailUrl ? 'none' : 'flex' }}>
                  {item.mediaType === 'video' ? '🎥' : 
                   item.mediaType === 'photo' ? '📷' : 
                   item.mediaType === 'audio' ? '🎵' : 
                   item.mediaType === 'document' ? '📄' :
                   item.mediaType === 'footage' ? '🎬' : 
                   item.mediaType === 'Photo' ? '📷' : '🎥'}
                </div>
              </div>
              <div className="media-info">
                <h3>{item.title}</h3>
                <p className="media-description">{item.description}</p>
                <div className="media-meta">
                  <span className="media-type">{item.mediaType}</span>
                  <span className="media-license">{item.licenseType}</span>
                </div>
                <div className="media-author">{t('media.by')} {item.journalist?.user?.firstName} {item.journalist?.user?.lastName}</div>
                <div className="media-stats">
                  <span>★ {item.rating || 0}</span>
                  <span>👁 {item.views || 0} {t('media.views')}</span>
                </div>
                <div className="media-price">
                  {item.price && typeof item.price === 'object' 
                    ? `${item.price.currency || 'USD'} ${item.price.amount || 0}`
                    : `$${item.price || 0}`
                  }
                </div>
                <button className="purchase-button">{t('media.purchase')}</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-media">
            <p>{t('media.noMediaFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaContent;
