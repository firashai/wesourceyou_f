import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiShoppingCart, FiEye, FiFilter, FiSearch } from 'react-icons/fi';
import './AdminPurchases.css';

const AdminPurchases = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPurchases();
  }, [currentPage]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      const response = await fetch(`http://localhost:3001/admin/purchases?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="unauthorized">{t('admin.unauthorized')}</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="header-content">
          <FiShoppingCart className="header-icon" />
          <div>
            <h1>{t('admin.purchases.title')}</h1>
            <p>{t('admin.purchases.subtitle')}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : (
        <>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.purchases.buyer')}</th>
                  <th>{t('admin.purchases.media')}</th>
                  <th>{t('admin.purchases.seller')}</th>
                  <th>{t('admin.purchases.amount')}</th>
                  <th>{t('admin.purchases.status')}</th>
                  <th>{t('admin.purchases.purchasedAt')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>
                      <div className="user-info">
                        <span className="user-name">
                          {purchase.buyer?.firstName} {purchase.buyer?.lastName}
                        </span>
                        <span className="user-email">{purchase.buyer?.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="media-info">
                        <span className="media-title">{purchase.mediaContent?.title}</span>
                        <span className="media-type">{purchase.mediaContent?.mediaType}</span>
                      </div>
                    </td>
                    <td>
                      <span className="seller-name">
                        {purchase.mediaContent?.journalist?.user?.firstName} {purchase.mediaContent?.journalist?.user?.lastName}
                      </span>
                    </td>
                    <td>
                      <span className="amount">
                        ${purchase.amount} {purchase.currency}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${purchase.status}`}>
                        {purchase.status}
                      </span>
                    </td>
                    <td>
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => window.open(`/media/${purchase.mediaContent?.id}`, '_blank')}
                          title={t('admin.actions.view')}
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {purchases.length === 0 && (
            <div className="empty-state">
              <p>{t('admin.purchases.noPurchases')}</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPurchases;
