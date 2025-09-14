import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiLinkedin, FiFacebook, FiInstagram } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: t('nav.home'), path: '/' },
      { label: t('nav.search'), path: '/search' },
      { label: t('nav.jobs'), path: '/jobs' },
      { label: t('nav.media'), path: '/media' },
      { label: t('nav.companies'), path: '/companies' },
      { label: t('nav.journalists'), path: '/journalists' },
    ],
    company: [
      { label: t('footer.about'), path: '/about' },
      { label: t('footer.contact'), path: '/contact' },
      { label: t('footer.privacy'), path: '/privacy' },
      { label: t('footer.terms'), path: '/terms' },
    ],
    support: [
      { label: t('footer.helpCenter'), path: '/help' },
      { label: t('footer.faq'), path: '/faq' },
      { label: t('footer.support'), path: '/support' },
      { label: t('footer.feedback'), path: '/feedback' },
    ],
  };

  const socialLinks = [
    { icon: FiTwitter, url: 'https://twitter.com/wesourceyou', label: t('footer.twitter') },
    { icon: FiLinkedin, url: 'https://linkedin.com/company/wesourceyou', label: t('footer.linkedin') },
    { icon: FiFacebook, url: 'https://facebook.com/wesourceyou', label: t('footer.facebook') },
    { icon: FiInstagram, url: 'https://instagram.com/wesourceyou', label: t('footer.instagram') },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <h3>WeSourceYou</h3>
              <p>{t('footer.tagline')}</p>
            </div>
            
            <div className="contact-info">
              <div className="contact-item">
                <FiMail className="contact-icon" />
                <span>contact@wesourceyou.com</span>
              </div>
              <div className="contact-item">
                <FiPhone className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FiMapPin className="contact-icon" />
                <span>{t('footer.globalNetwork')}</span>
              </div>
            </div>

            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={social.label}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="footer-section">
            <h4>{t('footer.platform')}</h4>
            <ul className="footer-links">
              {footerLinks.platform.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-section">
            <h4>{t('footer.company')}</h4>
            <ul className="footer-links">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-section">
            <h4>{t('footer.support')}</h4>
            <ul className="footer-links">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>{t('footer.copyright', { year: currentYear })}</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">{t('footer.privacy')}</Link>
              <Link to="/terms">{t('footer.terms')}</Link>
              <Link to="/cookies">{t('footer.cookies')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
