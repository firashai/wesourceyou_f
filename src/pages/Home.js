import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import { FiSearch, FiUsers, FiGlobe, FiAward, FiPlay, FiCamera, FiMic, FiEdit } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: FiSearch,
      title: t('home.features.direct'),
      description: t('home.features.direct.desc'),
      color: '#667eea',
    },
    {
      icon: FiAward,
      title: t('home.features.fair'),
      description: t('home.features.fair.desc'),
      color: '#10b981',
    },
    {
      icon: FiGlobe,
      title: t('home.features.smart'),
      description: t('home.features.smart.desc'),
      color: '#f59e0b',
    },
    {
      icon: FiUsers,
      title: t('home.features.global'),
      description: t('home.features.global.desc'),
      color: '#ef4444',
    },
  ];

  const mediaTypes = [
    { icon: FiCamera, label: 'Photography', count: '2,500+' },
    { icon: FiPlay, label: 'Video Production', count: '1,800+' },
    { icon: FiMic, label: 'Audio Recording', count: '1,200+' },
    { icon: FiEdit, label: 'Content Writing', count: '3,000+' },
  ];

  const stats = [
    { number: '10,000+', label: 'Media Professionals' },
    { number: '500+', label: 'Media Companies' },
    { number: '50+', label: 'Countries' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <>
      <Helmet>
        <title>WeSourceYou - Global Media Platform</title>
        <meta name="description" content="Connect with journalists, media professionals, and opportunities worldwide" />
      </Helmet>

      <div className="home">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  {t('home.hero.title')}
                </h1>
                <p className="hero-subtitle">
                  {t('home.hero.subtitle')}
                </p>
                <div className="hero-actions">
                  <Link to="/register" className="btn btn-primary btn-large">
                    {t('home.hero.cta')}
                  </Link>
                  <Link to="/search" className="btn btn-secondary btn-large">
                    {t('nav.search')}
                  </Link>
                </div>
              </div>
              <div className="hero-visual">
                <div className="hero-image">
                  <div className="floating-card card-1">
                    <FiCamera />
                    <span>Photographer</span>
                  </div>
                  <div className="floating-card card-2">
                    <FiPlay />
                    <span>Video Editor</span>
                  </div>
                  <div className="floating-card card-3">
                    <FiMic />
                    <span>Journalist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <div className="section-header">
              <h2>{t('home.features.title')}</h2>
              <p>Discover why media professionals and companies choose WeSourceYou</p>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                    <feature.icon />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Types Section */}
        <section className="media-types">
          <div className="container">
            <div className="section-header">
              <h2>Media Specialties</h2>
              <p>Find professionals across all media disciplines</p>
            </div>
            <div className="media-types-grid">
              {mediaTypes.map((type, index) => (
                <div key={index} className="media-type-card">
                  <div className="media-type-icon">
                    <type.icon />
                  </div>
                  <h3>{type.label}</h3>
                  <div className="media-type-count">{type.count}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Connect?</h2>
              <p>Join thousands of media professionals and companies worldwide</p>
              <div className="cta-actions">
                <Link to="/register/journalist" className="btn btn-primary btn-large">
                  Join as Journalist
                </Link>
                <Link to="/register/company" className="btn btn-secondary btn-large">
                  Join as Company
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
