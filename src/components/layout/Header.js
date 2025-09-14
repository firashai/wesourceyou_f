import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiMenu, FiX, FiGlobe, FiUser, FiLogOut } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
  ];

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/search', label: t('nav.search') },
    { path: '/jobs', label: t('nav.jobs') },
    { path: '/media', label: t('nav.media') },
    { path: '/companies', label: t('nav.companies') },
    { path: '/journalists', label: t('nav.journalists') },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <h1>WeSourceYou</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Language, Auth */}
          <div className="header-right">
            {/* Language Selector */}
            <div className="language-selector">
              <FiGlobe className="language-icon" />
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-info">
                  <FiUser className="user-icon" />
                  <span className="user-name">
                    {user?.firstName || user?.email}
                  </span>
                </div>
                <div className="user-dropdown">
                  <Link to="/dashboard" className="dropdown-item">
                    {t('nav.dashboard')}
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to={`/profile/${user?.role}`} className="dropdown-item">
                    {t('nav.profile')}
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <FiLogOut />
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-primary">
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="nav-mobile">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.dashboard')}
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to={`/profile/${user?.role}`}
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.profile')}
                </Link>
                <button onClick={handleLogout} className="nav-link logout">
                  <FiLogOut />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
