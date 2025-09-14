import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiEdit, FiSave, FiX, FiMail, FiPhone, FiMapPin, FiUser } from 'react-icons/fi';
import '../Profile.css';

const AdminProfile = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For admin, we'll use the user data directly since admin profile is simpler
        const adminProfile = {
          user: user,
          role: 'admin',
          permissions: ['manage_users', 'manage_journalists', 'manage_companies', 'manage_jobs', 'manage_media'],
          lastLogin: new Date().toISOString(),
          totalActions: 156,
          systemStats: {
            totalUsers: 1234,
            totalJournalists: 567,
            totalCompanies: 89,
            totalJobs: 234,
            totalMedia: 456
          }
        };
        
        setProfile(adminProfile);
        setEditForm({
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          phoneNumber: user?.phoneNumber || '',
          country: user?.country || '',
          city: user?.city || ''
        });
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      country: user?.country || '',
      city: user?.city || ''
    });
  };

  const handleSave = async () => {
    try {
      // In a real application, you would call an API to update the admin profile
      // For now, we'll just update the local state
      setProfile(prev => ({
        ...prev,
        user: {
          ...prev.user,
          ...editForm
        }
      }));
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div className="error">{t('common.profileNotFound')}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FiUser size={80} />
        </div>
        <div className="profile-info">
          <div className="profile-title-section">
            <h1>{profile.user?.firstName} {profile.user?.lastName}</h1>
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button className="action-btn primary" onClick={handleSave}>
                    <FiSave />
                    {t('common.save')}
                  </button>
                  <button className="action-btn secondary" onClick={handleCancel}>
                    <FiX />
                    {t('common.cancel')}
                  </button>
                </>
              ) : (
                <button className="action-btn primary" onClick={handleEdit}>
                  <FiEdit />
                  {t('common.edit')}
                </button>
              )}
            </div>
          </div>
          <p className="profile-location">
            <FiMapPin />
            {profile.user?.city}, {profile.user?.country}
          </p>
          <p className="profile-role">System Administrator</p>
          <div className="profile-badge">
            <span className="admin-badge">Admin</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="admin-details">
            <div className="detail-item">
              <strong>First Name:</strong> 
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="First Name"
                />
              ) : (
                profile.user?.firstName
              )}
            </div>
            <div className="detail-item">
              <strong>Last Name:</strong> 
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Last Name"
                />
              ) : (
                profile.user?.lastName
              )}
            </div>
            <div className="detail-item">
              <strong>Email:</strong> 
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Email"
                />
              ) : (
                profile.user?.email
              )}
            </div>
            <div className="detail-item">
              <strong>Phone:</strong> 
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phoneNumber || ''}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Phone Number"
                />
              ) : (
                profile.user?.phoneNumber
              )}
            </div>
            <div className="detail-item">
              <strong>Country:</strong> 
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Country"
                />
              ) : (
                profile.user?.country
              )}
            </div>
            <div className="detail-item">
              <strong>City:</strong> 
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              ) : (
                profile.user?.city
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Administrative Information</h2>
          <div className="admin-stats">
            <div className="stat-item">
              <strong>Role:</strong> System Administrator
            </div>
            <div className="stat-item">
              <strong>Permissions:</strong>
              <div className="permissions-list">
                {profile.permissions.map((permission, index) => (
                  <span key={index} className="permission-tag">{permission}</span>
                ))}
              </div>
            </div>
            <div className="stat-item">
              <strong>Last Login:</strong> {new Date(profile.lastLogin).toLocaleString()}
            </div>
            <div className="stat-item">
              <strong>Total Actions:</strong> {profile.totalActions}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>System Statistics</h2>
          <div className="system-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{profile.systemStats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Journalists</h3>
              <p className="stat-number">{profile.systemStats.totalJournalists}</p>
            </div>
            <div className="stat-card">
              <h3>Total Companies</h3>
              <p className="stat-number">{profile.systemStats.totalCompanies}</p>
            </div>
            <div className="stat-card">
              <h3>Total Jobs</h3>
              <p className="stat-number">{profile.systemStats.totalJobs}</p>
            </div>
            <div className="stat-card">
              <h3>Total Media</h3>
              <p className="stat-number">{profile.systemStats.totalMedia}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Contact Information</h2>
          <div className="contact-info">
            <p><FiMail /> <strong>Email:</strong> {profile.user?.email}</p>
            <p><FiPhone /> <strong>Phone:</strong> {profile.user?.phoneNumber || 'Not specified'}</p>
            <p><FiMapPin /> <strong>Location:</strong> {profile.user?.city}, {profile.user?.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
