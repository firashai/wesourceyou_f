import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterJournalist from './pages/auth/RegisterJournalist';
import RegisterCompany from './pages/auth/RegisterCompany';
import Dashboard from './pages/dashboard/Dashboard';
import Journalists from './pages/Journalists';
import JournalistProfile from './pages/journalist/JournalistProfile';
import Companies from './pages/Companies';
import CompanyProfile from './pages/company/CompanyProfile';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/jobs/CreateJob';
import EditJob from './pages/jobs/EditJob';
import MyJobs from './pages/jobs/MyJobs';
import Applications from './pages/applications/Applications';
import ApplicationDetails from './pages/applications/ApplicationDetails';
import MediaContent from './pages/MediaContent';
import UserMediaPage from './pages/media/UserMediaPage';
import Search from './pages/Search';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJournalists from './pages/admin/AdminJournalists';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminJobs from './pages/admin/AdminJobs';
import AdminMedia from './pages/admin/AdminMedia';
import AdminUsers from './pages/admin/AdminUsers';
import AdminApplications from './pages/admin/AdminApplications';
import AdminPurchases from './pages/admin/AdminPurchases';
import AdminProfile from './pages/admin/AdminProfile';
import ProfilePage from './pages/ProfilePage';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AuthenticatedRedirect = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <AuthenticatedRedirect>
              <Login />
            </AuthenticatedRedirect>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/register/journalist" element={<RegisterJournalist />} />
          <Route path="/register/company" element={<RegisterCompany />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/journalists" element={<Journalists />} />
          <Route path="/journalists/:id" element={<JournalistProfile />} />
          <Route path="/journalist/:id" element={<JournalistProfile />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyProfile />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/create" element={
            <ProtectedRoute allowedRoles={['company']}>
              <CreateJob />
            </ProtectedRoute>
          } />
          <Route path="/jobs/:id/edit" element={
            <ProtectedRoute allowedRoles={['company']}>
              <EditJob />
            </ProtectedRoute>
          } />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/media" element={<MediaContent />} />
          <Route path="/search" element={<Search />} />
          
          {/* User-specific routes */}
          <Route path="/profile/:role" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/jobs/my" element={
            <ProtectedRoute allowedRoles={['company']}>
              <MyJobs />
            </ProtectedRoute>
          } />
          
          <Route path="/applications" element={
            <ProtectedRoute allowedRoles={['company']}>
              <Applications />
            </ProtectedRoute>
          } />
          
          <Route path="/applications/:id" element={
            <ProtectedRoute allowedRoles={['company']}>
              <ApplicationDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/media/my" element={
            <ProtectedRoute>
              <UserMediaPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/journalists" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminJournalists />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/companies" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCompanies />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/jobs" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminJobs />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/media" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminMedia />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/applications" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminApplications />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/purchases" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPurchases />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
