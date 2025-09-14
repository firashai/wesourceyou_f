import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        setError('root', {
          type: 'manual',
          message: result.error,
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - WeSourceYou</title>
        <meta name="description" content="Sign in to your WeSourceYou account" />
      </Helmet>

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>{t('auth.login.title')}</h1>
              <p>{t('auth.login.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  {t('auth.email')}
                </label>
                <div className="input-group">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  {t('auth.password')}
                </label>
                <div className="input-group">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password.message}</span>
                )}
              </div>

              {/* Root Error */}
              {errors.root && (
                <div className="error-message root-error">
                  {errors.root.message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner small"></div>
                ) : (
                  t('auth.login')
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="auth-links">
              <Link to="/forgot-password" className="auth-link">
                {t('auth.forgotPassword')}
              </Link>
              <div className="auth-divider">
                <span>{t('auth.noAccount')}</span>
                <Link to="/register" className="auth-link">
                  {t('auth.register')}
                </Link>
              </div>
            </div>

            {/* Social Login (Future Feature) */}
            <div className="social-login">
              <div className="social-divider">
                <span>Or continue with</span>
              </div>
              <div className="social-buttons">
                <button className="btn btn-secondary btn-social" disabled>
                  Google
                </button>
                <button className="btn btn-secondary btn-social" disabled>
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
