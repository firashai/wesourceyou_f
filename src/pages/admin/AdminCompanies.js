import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiEye, FiCheck, FiX, FiRefreshCw, FiEdit } from 'react-icons/fi';
import EditDialog from '../../components/admin/EditDialog';
import './AdminCompanies.css';

const AdminCompanies = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, verified, pending
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [approvalDialog, setApprovalDialog] = useState({ show: false, item: null, action: null });
  const [editDialog, setEditDialog] = useState({ show: false, item: null });

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
      });
      
      if (filter === 'verified') {
        params.append('verified', 'true');
      } else if (filter === 'pending') {
        params.append('verified', 'false');
      }

      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/companies?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, filter]);

  const handleApproval = async (companyId, approved, notes = '') => {
    try {
      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/companies/${companyId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved, notes }),
      });

      if (response.ok) {
        fetchCompanies();
        setApprovalDialog({ show: false, item: null, action: null });
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/companies/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        fetchCompanies();
        return Promise.resolve();
      } else {
        throw new Error('Failed to update company');
      }
    } catch (error) {
      console.error('Error updating company:', error);
      return Promise.reject(error);
    }
  };

  const handleBulkApproval = async (approved) => {
    if (selectedItems.length === 0) return;

    try {
      const response = await fetch('https://wesourceyoub2.vercel.app/admin/companies/bulk-approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyIds: selectedItems,
          approved,
        }),
      });

      if (response.ok) {
        setSelectedItems([]);
        fetchCompanies();
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
    if (selectedItems.length === companies.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(companies.map(c => c.id));
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="unauthorized">{t('admin.unauthorized')}</div>;
  }

  return (
    <div className="admin-companies">
      <div className="page-header">
        <h1>{t('admin.companies.title')}</h1>
        <p>{t('admin.companies.subtitle')}</p>
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
            className={`filter-btn ${filter === 'verified' ? 'active' : ''}`}
            onClick={() => setFilter('verified')}
          >
            {t('admin.filters.verified')}
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
          <button className="refresh-btn" onClick={fetchCompanies}>
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : (
        <div className="companies-table">
          <table>
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === companies.length && companies.length > 0}
                    onChange={selectAll}
                  />
                </th>
                <th>{t('admin.companies.name')}</th>
                <th>{t('admin.companies.email')}</th>
                <th>{t('admin.companies.industry')}</th>
                <th>{t('admin.companies.status')}</th>
                <th>{t('admin.companies.createdAt')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(company.id)}
                      onChange={() => toggleSelection(company.id)}
                    />
                  </td>
                  <td>
                    <div className="company-info">
                      <div className="company-name">
                        {company.name}
                      </div>
                      <div className="company-location">
                        {company.user?.city}, {company.user?.country}
                      </div>
                    </div>
                  </td>
                  <td>{company.user?.email}</td>
                  <td>
                    <span className="industry-tag">
                      {company.industry?.[0] || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${company.isVerified ? 'verified' : 'pending'}`}>
                      {company.isVerified ? t('admin.status.verified') : t('admin.status.pending')}
                    </span>
                  </td>
                  <td>{new Date(company.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => window.open(`/companies/${company.id}`, '_blank')}
                        title={t('admin.actions.view')}
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => setEditDialog({ show: true, item: company })}
                        title={t('admin.actions.edit')}
                      >
                        <FiEdit />
                      </button>
                      {!company.isVerified && (
                        <button 
                          className="action-btn approve"
                          onClick={() => setApprovalDialog({ 
                            show: true, 
                            item: company, 
                            action: 'approve' 
                          })}
                          title={t('admin.actions.approve')}
                        >
                          <FiCheck />
                        </button>
                      )}
                      {company.isVerified && (
                        <button 
                          className="action-btn reject"
                          onClick={() => setApprovalDialog({ 
                            show: true, 
                            item: company, 
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
                ? t('admin.approveCompany') 
                : t('admin.rejectCompany')
              }
            </h3>
            <p>
              {approvalDialog.action === 'approve' 
                ? t('admin.approveCompanyConfirm')
                : t('admin.rejectCompanyConfirm')
              }
            </p>
            <div className="company-info">
              <strong>{approvalDialog.item?.name}</strong>
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
        type="company"
        title={t('admin.editCompany')}
      />
    </div>
  );
};

export default AdminCompanies;
