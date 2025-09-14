import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import JournalistProfile from './journalist/JournalistProfile';
import CompanyProfile from './company/CompanyProfile';
import AdminProfile from './admin/AdminProfile';

const ProfilePage = () => {
  const { role } = useParams();
  const { user } = useAuth();

  // If the role in URL doesn't match the user's role, redirect to correct profile
  if (user && user.role !== role) {
    return <Navigate to={`/profile/${user.role}`} replace />;
  }

  switch (role) {
    case 'journalist':
      return <JournalistProfile />;
    case 'company':
      return <CompanyProfile />;
    case 'admin':
      return <AdminProfile />;
    default:
      return <div>Invalid profile type</div>;
  }
};

export default ProfilePage;
