import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiX, FiEye, FiEdit } from 'react-icons/fi';
import EditDialog from '../../components/admin/EditDialog';
import './AdminMedia.css';

const AdminMedia = () => {
  const { t } = useTranslation();
  const [mediaContent, setMediaContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // all, approved, pending
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [action, setAction] = useState(''); // approve or reject
  const [notes, setNotes] = useState('');
  const [editDialog, setEditDialog] = useState({ show: false, item: null });

  const fetchMediaContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const approved = filter === 'all' ? undefined : filter === 'approved';
      
      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/media?page=${currentPage}&limit=10${approved !== undefined ? `&approved=${approved}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMediaContent(data.mediaContent);
        setTotalPages(data.totalPages);
      } else {
        console.error('Failed to fetch media content');
      }
    } catch (error) {
      console.error('Error fetching media content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaContent();
  }, [currentPage, filter]);

  const handleApproval = async (mediaId, approved) => {
    setSelectedItem(mediaContent.find(media => media.id === mediaId));
    setAction(approved ? 'approve' : 'reject');
    setShowModal(true);
  };

  const confirmApproval = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/media/${selectedItem.id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approved: action === 'approve',
          notes: notes,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setSelectedItem(null);
        setAction('');
        setNotes('');
        fetchMediaContent();
      } else {
        console.error('Failed to update media approval status');
      }
    } catch (error) {
      console.error('Error updating media approval status:', error);
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/media/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        fetchMediaContent();
        return Promise.resolve();
      } else {
        throw new Error('Failed to update media');
      }
    } catch (error) {
      console.error('Error updating media:', error);
      return Promise.reject(error);
    }
  };

  const handleBulkApproval = async (approved) => {
    if (selectedMedia.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/media/bulk-approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaIds: selectedMedia,
          approved: approved,
        }),
      });

      if (response.ok) {
        setSelectedMedia([]);
        fetchMediaContent();
      } else {
        console.error('Failed to bulk update media');
      }
    } catch (error) {
      console.error('Error bulk updating media:', error);
    }
  };

  const toggleSelection = (mediaId) => {
    setSelectedMedia(prev => 
      prev.includes(mediaId) 
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  const selectAll = () => {
    if (selectedMedia.length === mediaContent.length) {
      setSelectedMedia([]);
    } else {
      setSelectedMedia(mediaContent.map(media => media.id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="admin-media-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-media-container">
      <div className="page-header">
        <h1>{t('admin.media.title')}</h1>
        <p>{t('admin.media.subtitle')}</p>
      </div>

      <div className="controls">
        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            {t('admin.filters.all')}
          </button>
          <button 
            className={filter === 'approved' ? 'active' : ''} 
            onClick={() => setFilter('approved')}
          >
            {t('admin.filters.approved')}
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            {t('admin.filters.pending')}
          </button>
        </div>

        {selectedMedia.length > 0 && (
          <div className="bulk-actions">
            <button 
              className="bulk-approve"
              onClick={() => handleBulkApproval(true)}
            >
              <FiCheck /> {t('admin.bulkApprove')}
            </button>
            <button 
              className="bulk-reject"
              onClick={() => handleBulkApproval(false)}
            >
              <FiX /> {t('admin.bulkReject')}
            </button>
          </div>
        )}
      </div>

      <div className="media-table-container">
        <table className="media-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={selectedMedia.length === mediaContent.length && mediaContent.length > 0}
                  onChange={selectAll}
                />
              </th>
              <th>{t('admin.media.title')}</th>
              <th>{t('admin.media.journalist')}</th>
              <th>{t('admin.media.type')}</th>
              <th>{t('admin.media.size')}</th>
              <th>{t('admin.media.status')}</th>
              <th>{t('admin.media.createdAt')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {mediaContent.map(media => (
              <tr key={media.id}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedMedia.includes(media.id)}
                    onChange={() => toggleSelection(media.id)}
                  />
                </td>
                <td>
                  <div className="media-title">
                    <strong>{media.title}</strong>
                    <span className="media-description">{media.description?.substring(0, 100)}...</span>
                  </div>
                </td>
                <td>{media.journalist?.user?.firstName} {media.journalist?.user?.lastName}</td>
                <td>{media.mediaType}</td>
                <td>{formatFileSize(media.fileSize || 0)}</td>
                <td>
                  <span className={`status-badge ${media.isApproved ? 'approved' : 'pending'}`}>
                    {media.isApproved ? t('admin.status.approved') : t('admin.status.pending')}
                  </span>
                </td>
                <td>{formatDate(media.createdAt)}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn"
                    onClick={() => window.open(`/media?mediaId=${media.id}`, '_blank')}
                    title={t('admin.actions.view')}
                  >
                    <FiEye />
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => setEditDialog({ show: true, item: media })}
                    title={t('admin.actions.edit')}
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="approve-btn"
                    onClick={() => handleApproval(media.id, true)}
                    disabled={media.isApproved}
                    title={t('admin.actions.approve')}
                  >
                    <FiCheck />
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleApproval(media.id, false)}
                    disabled={!media.isApproved}
                    title={t('admin.actions.reject')}
                  >
                    <FiX />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Approval Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>
              {action === 'approve' 
                ? t('admin.approveMedia') 
                : t('admin.rejectMedia')
              }
            </h3>
            <p>
              {action === 'approve' 
                ? t('admin.approveMediaConfirm') 
                : t('admin.rejectMediaConfirm')
              }
            </p>
            <div className="modal-content">
              <div className="media-details">
                <h4>{selectedItem?.title}</h4>
                <p><strong>Journalist:</strong> {selectedItem?.journalist?.user?.firstName} {selectedItem?.journalist?.user?.lastName}</p>
                <p><strong>Type:</strong> {selectedItem?.mediaType}</p>
                <p><strong>Size:</strong> {formatFileSize(selectedItem?.fileSize || 0)}</p>
                <p><strong>Description:</strong> {selectedItem?.description?.substring(0, 200)}...</p>
              </div>
              <div className="notes-section">
                <label htmlFor="notes">Notes (optional):</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this decision..."
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className={action === 'approve' ? 'approve-btn' : 'reject-btn'}
                onClick={confirmApproval}
              >
                {action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <EditDialog
        isOpen={editDialog.show}
        onClose={() => setEditDialog({ show: false, item: null })}
        onSave={handleEdit}
        data={editDialog.item}
        type="media"
        title={t('admin.editMedia')}
      />
    </div>
  );
};

export default AdminMedia;
