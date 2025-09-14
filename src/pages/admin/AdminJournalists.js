import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiEye, FiCheck, FiX, FiRefreshCw, FiEdit } from 'react-icons/fi';
import EditDialog from '../../components/admin/EditDialog';
import './AdminJournalists.css';

const AdminJournalists = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, approved, pending
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [approvalDialog, setApprovalDialog] = useState({ show: false, item: null, action: null });
  const [editDialog, setEditDialog] = useState({ show: false, item: null });

  const fetchJournalists = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
      });
      
      if (filter === 'approved') {
        params.append('approved', 'true');
      } else if (filter === 'pending') {
        params.append('approved', 'false');
      }

      const response = await fetch(`http://localhost:3001/admin/journalists?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJournalists(data.journalists);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching journalists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalists();
  }, [currentPage, filter]);

  const handleApproval = async (journalistId, approved, notes = '') => {
    try {
      const response = await fetch(`http://localhost:3001/admin/journalists/${journalistId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved, notes }),
      });

      if (response.ok) {
        fetchJournalists();
        setApprovalDialog({ show: false, item: null, action: null });
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/journalists/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        fetchJournalists();
        return Promise.resolve();
      } else {
        throw new Error('Failed to update journalist');
      }
    } catch (error) {
      console.error('Error updating journalist:', error);
      return Promise.reject(error);
    }
  };

  const handleBulkApproval = async (approved) => {
    if (selectedItems.length === 0) return;

    try {
      const response = await fetch('http://localhost:3001/admin/journalists/bulk-approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          journalistIds: selectedItems,
          approved,
        }),
      });

      if (response.ok) {
        setSelectedItems([]);
        fetchJournalists();
      }
    } catch (error) {
      console.error('Error bulk updating approval status:', error);
    }
  };

  const toggleSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === journalists.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(journalists.map(j => j.id));
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="unauthorized">{t('admin.unauthorized')}</div>;
  }

  return (
    <div className="admin-journalists">
      <div className="page-header">
        <h1>{t('admin.journalists.title')}</h1>
        <p>{t('admin.journalists.subtitle')}</p>
      </div>

      <div className="controls">
        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('admin.filters.all')}
          </button>
          <button 
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            {t('admin.filters.approved')}
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            {t('admin.filters.pending')}
          </button>
        </div>

        <div className="bulk-actions">
          {selectedItems.length > 0 && (
            <>
              <button 
                className="bulk-btn approve"
                onClick={() => handleBulkApproval(true)}
              >
                <FiCheck /> {t('admin.bulkApprove')} ({selectedItems.length})
              </button>
              <button 
                className="bulk-btn reject"
                onClick={() => handleBulkApproval(false)}
              >
                <FiX /> {t('admin.bulkReject')} ({selectedItems.length})
              </button>
            </>
          )}
          <button className="refresh-btn" onClick={fetchJournalists}>
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : (
        <div className="journalists-table">
          <table>
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === journalists.length && journalists.length > 0}
                    onChange={selectAll}
                  />
                </th>
                <th>{t('admin.journalists.name')}</th>
                <th>{t('admin.journalists.email')}</th>
                <th>{t('admin.journalists.specialty')}</th>
                <th>{t('admin.journalists.status')}</th>
                <th>{t('admin.journalists.createdAt')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {journalists.map((journalist) => (
                <tr key={journalist.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(journalist.id)}
                      onChange={() => toggleSelection(journalist.id)}
                    />
                  </td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">
                        {journalist.user?.firstName} {journalist.user?.lastName}
                      </div>
                      <div className="user-location">
                        {journalist.user?.city}, {journalist.user?.country}
                      </div>
                    </div>
                  </td>
                  <td>{journalist.user?.email}</td>
                  <td>
                    <span className="specialty-tag">
                      {journalist.mediaWorkType}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${journalist.isApproved ? 'approved' : 'pending'}`}>
                      {journalist.isApproved ? t('admin.status.approved') : t('admin.status.pending')}
                    </span>
                  </td>
                  <td>{new Date(journalist.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => window.open(`/journalist/${journalist.id}`, '_blank')}
                        title={t('admin.actions.view')}
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => setEditDialog({ show: true, item: journalist })}
                        title={t('admin.actions.edit')}
                      >
                        <FiEdit />
                      </button>
                      {!journalist.isApproved && (
                        <button 
                          className="action-btn approve"
                          onClick={() => setApprovalDialog({ 
                            show: true, 
                            item: journalist, 
                            action: 'approve' 
                          })}
                          title={t('admin.actions.approve')}
                        >
                          <FiCheck />
                        </button>
                      )}
                      {journalist.isApproved && (
                        <button 
                          className="action-btn reject"
                          onClick={() => setApprovalDialog({ 
                            show: true, 
                            item: journalist, 
                            action: 'reject' 
                          })}
                          title={t('admin.actions.reject')}
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            {t('common.previous')}
          </button>
          <span>{t('common.page')} {currentPage} {t('common.of')} {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            {t('common.next')}
          </button>
        </div>
      )}

      {/* Approval Dialog */}
      {approvalDialog.show && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {approvalDialog.action === 'approve' 
                ? t('admin.approveJournalist') 
                : t('admin.rejectJournalist')
              }
            </h3>
            <p>
              {approvalDialog.action === 'approve' 
                ? t('admin.approveJournalistConfirm')
                : t('admin.rejectJournalistConfirm')
              }
            </p>
            <div className="journalist-info">
              <strong>{approvalDialog.item?.user?.firstName} {approvalDialog.item?.user?.lastName}</strong>
              <span>{approvalDialog.item?.user?.email}</span>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setApprovalDialog({ show: false, item: null, action: null })}
              >
                {t('common.cancel')}
              </button>
              <button 
                className={`confirm-btn ${approvalDialog.action === 'approve' ? 'approve' : 'reject'}`}
                onClick={() => handleApproval(
                  approvalDialog.item.id, 
                  approvalDialog.action === 'approve'
                )}
              >
                {approvalDialog.action === 'approve' 
                  ? t('admin.approve') 
                  : t('admin.reject')
                }
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
        type="journalist"
        title={t('admin.editJournalist')}
      />
    </div>
  );
};

export default AdminJournalists;
