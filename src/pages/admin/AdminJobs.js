import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiX, FiEye, FiEdit } from 'react-icons/fi';
import EditDialog from '../../components/admin/EditDialog';
import './AdminJobs.css';

const AdminJobs = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all'); // all, approved, pending
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [action, setAction] = useState(''); // approve or reject
  const [notes, setNotes] = useState('');
  const [editDialog, setEditDialog] = useState({ show: false, item: null });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const approved = filter === 'all' ? undefined : filter === 'approved';
      
      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/jobs?page=${currentPage}&limit=10${approved !== undefined ? `&approved=${approved}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } else {
        console.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, filter]);

  const handleApproval = async (jobId, approved) => {
    setSelectedJob(jobs.find(job => job.id === jobId));
    setAction(approved ? 'approve' : 'reject');
    setShowModal(true);
  };

  const confirmApproval = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/jobs/${selectedJob.id}/approve`, {
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
        setSelectedJob(null);
        setAction('');
        setNotes('');
        fetchJobs();
      } else {
        console.error('Failed to update job approval status');
      }
    } catch (error) {
      console.error('Error updating job approval status:', error);
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/jobs/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        fetchJobs();
        return Promise.resolve();
      } else {
        throw new Error('Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      return Promise.reject(error);
    }
  };

  const handleBulkApproval = async (approved) => {
    if (selectedJobs.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://wesourceyoub2.vercel.app/admin/jobs/bulk-approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobIds: selectedJobs,
          approved: approved,
        }),
      });

      if (response.ok) {
        setSelectedJobs([]);
        fetchJobs();
      } else {
        console.error('Failed to bulk update jobs');
      }
    } catch (error) {
      console.error('Error bulk updating jobs:', error);
    }
  };

  const toggleSelection = (jobId) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const selectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(job => job.id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="admin-jobs-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-jobs-container">
      <div className="page-header">
        <h1>{t('admin.jobs.title')}</h1>
        <p>{t('admin.jobs.subtitle')}</p>
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

        {selectedJobs.length > 0 && (
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

      <div className="jobs-table-container">
        <table className="jobs-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={selectedJobs.length === jobs.length && jobs.length > 0}
                  onChange={selectAll}
                />
              </th>
              <th>{t('admin.jobs.title')}</th>
              <th>{t('admin.jobs.company')}</th>
              <th>{t('admin.jobs.jobType')}</th>
              <th>{t('admin.jobs.status')}</th>
              <th>{t('admin.jobs.createdAt')}</th>
              <th>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedJobs.includes(job.id)}
                    onChange={() => toggleSelection(job.id)}
                  />
                </td>
                <td>
                  <div className="job-title">
                    <strong>{job.title}</strong>
                    <span className="job-description">{job.description?.substring(0, 100)}...</span>
                  </div>
                </td>
                <td>{job.company?.name || 'N/A'}</td>
                <td>{job.jobType}</td>
                <td>
                  <span className={`status-badge ${job.isApproved ? 'approved' : 'pending'}`}>
                    {job.isApproved ? t('admin.status.approved') : t('admin.status.pending')}
                  </span>
                </td>
                <td>{formatDate(job.createdAt)}</td>
                <td className="action-buttons">
                  <button 
                    className="view-btn"
                    onClick={() => window.open(`/jobs?jobId=${job.id}`, '_blank')}
                    title={t('admin.actions.view')}
                  >
                    <FiEye />
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => setEditDialog({ show: true, item: job })}
                    title={t('admin.actions.edit')}
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="approve-btn"
                    onClick={() => handleApproval(job.id, true)}
                    disabled={job.isApproved}
                    title={t('admin.actions.approve')}
                  >
                    <FiCheck />
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleApproval(job.id, false)}
                    disabled={!job.isApproved}
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
                ? t('admin.approveJob') 
                : t('admin.rejectJob')
              }
            </h3>
            <p>
              {action === 'approve' 
                ? t('admin.approveJobConfirm') 
                : t('admin.rejectJobConfirm')
              }
            </p>
            <div className="modal-content">
              <div className="job-details">
                <h4>{selectedJob?.title}</h4>
                <p><strong>Company:</strong> {selectedJob?.company?.name}</p>
                <p><strong>Job Type:</strong> {selectedJob?.jobType}</p>
                <p><strong>Description:</strong> {selectedJob?.description?.substring(0, 200)}...</p>
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
        type="job"
        title={t('admin.editJob')}
      />
    </div>
  );
};

export default AdminJobs;
