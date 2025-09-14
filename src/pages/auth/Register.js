import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    if (type === 'journalist') {
      navigate('/register/journalist');
    } else if (type === 'company') {
      navigate('/register/company');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Join WeSourceYou</h1>
          <p>Connect with media professionals worldwide</p>
        </div>

        <div className="user-type-selection">
          <h2>Choose Your Account Type</h2>
          
          <div className="user-type-options">
            <div 
              className={`user-type-option ${userType === 'journalist' ? 'selected' : ''}`}
              onClick={() => handleUserTypeSelect('journalist')}
            >
              <div className="user-type-icon">📷</div>
              <h3>Journalist</h3>
              <p>I'm a media professional looking for opportunities</p>
              <ul>
                <li>Showcase your work</li>
                <li>Find job opportunities</li>
                <li>Connect with media companies</li>
                <li>Sell your media content</li>
              </ul>
            </div>

            <div 
              className={`user-type-option ${userType === 'company' ? 'selected' : ''}`}
              onClick={() => handleUserTypeSelect('company')}
            >
              <div className="user-type-icon">🏢</div>
              <h3>Media Company</h3>
              <p>I'm a company looking for media professionals</p>
              <ul>
                <li>Find talented professionals</li>
                <li>Post job opportunities</li>
                <li>Purchase media content</li>
                <li>Build your team</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
