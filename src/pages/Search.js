import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { searchAPI } from '../services/api';
import { FiSearch, FiFilter, FiMapPin, FiBriefcase, FiCamera, FiGlobe, FiDollarSign, FiCalendar } from 'react-icons/fi';
import './Search.css';

const Search = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    mediaWorkType: '',
    experienceLevel: '',
    hasCamera: false,
    canTravel: false,
    skills: [],
    languages: [],
    salaryRange: '',
    jobType: '',
    mediaType: '',
    companySize: '',
    industry: '',
    dateRange: '',
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const mediaWorkTypes = [
    'Producer', 'Reporter', 'TV Cameraman', 'Photographer', 
    'Video Editor', 'Trainer', 'Graphic Designer', 'Lawyer', 
    'Voice-over artist', 'Translator', 'Analyst'
  ];

  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior', 'Expert'];
  const jobTypes = ['Freelance', 'Contract', 'Full-time', 'Part-time', 'Internship'];
  const mediaTypes = ['Video', 'Photo', 'Audio', 'Text', 'Mixed'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const industries = ['News', 'Entertainment', 'Documentary', 'Corporate', 'Educational', 'Advertising'];
  const salaryRanges = ['$0-$25k', '$25k-$50k', '$50k-$75k', '$75k-$100k', '$100k+'];
  const dateRanges = ['Last 24 hours', 'Last week', 'Last month', 'Last 3 months', 'Last year'];

  // Load initial data when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const response = await searchAPI.global('', { type: 'all' });
        setResults(response.data || {});
      } catch (error) {
        console.error('Error loading initial data:', error);
        setResults({});
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      // If search term is empty, pass empty string to get all data
      const query = searchTerm.trim() || '';
      const response = await searchAPI.global(query, { type: searchType, ...filters });
      setResults(response.data || {});
    } catch (error) {
      console.error('Search error:', error);
      // Show empty results on error
      setResults({});
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      mediaWorkType: '',
      experienceLevel: '',
      hasCamera: false,
      canTravel: false,
      skills: [],
      languages: [],
      salaryRange: '',
      jobType: '',
      mediaType: '',
      companySize: '',
      industry: '',
      dateRange: '',
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>{t('search.title')}</h1>
        <p>{t('search.subtitle')}</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search.placeholder')}
            className="search-input"
          />
          </div>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select"
          >
            <option value="all">{t('common.all')}</option>
            <option value="journalists">{t('search.journalists')}</option>
            <option value="companies">{t('search.companies')}</option>
            <option value="jobs">{t('search.jobs')}</option>
            <option value="media">{t('search.mediaContent')}</option>
          </select>
          <button type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? t('search.searching') : t('search.button')}
          </button>
          <button 
            type="button" 
            className="show-all-button" 
            onClick={() => handleSearch({ preventDefault: () => {} })}
            disabled={isLoading}
          >
            {t('search.showAll')}
          </button>
        </div>

        <div className="search-filters-toggle">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle-button"
          >
            <FiFilter />
            {showFilters ? t('search.hideFilters') : t('search.filters')}
          </button>
        </div>

        {showFilters && (
          <div className="search-filters">
            <div className="filters-grid">
              {/* Location Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <FiMapPin />
                  {t('search.location')}
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  placeholder={t('search.enterLocation')}
                  className="filter-input"
                />
              </div>

              {/* Media Work Type */}
              <div className="filter-group">
                <label className="filter-label">
                  <FiBriefcase />
                  {t('search.mediaWorkType')}
                </label>
                <select
                  value={filters.mediaWorkType}
                  onChange={(e) => updateFilter('mediaWorkType', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('common.allTypes')}</option>
                  {mediaWorkTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div className="filter-group">
                <label className="filter-label">
                  <FiGlobe />
                  {t('search.experience')}
                </label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => updateFilter('experienceLevel', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('common.allLevels')}</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div className="filter-group">
                <label className="filter-label">
                  <FiBriefcase />
                  {t('search.jobType')}
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => updateFilter('jobType', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('common.allTypes')}</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Media Type */}
              <div className="filter-group">
                <label className="filter-label">
                  <FiCamera />
                  {t('search.mediaType')}
                </label>
                <select
                  value={filters.mediaType}
                  onChange={(e) => updateFilter('mediaType', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('common.allTypes')}</option>
                  {mediaTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Salary Range */}
              <div className="filter-group">
                <label className="filter-label">
                  <FiDollarSign />
                  {t('search.priceRange')}
                </label>
                <select
                  value={filters.salaryRange}
                  onChange={(e) => updateFilter('salaryRange', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('search.allRanges')}</option>
                  {salaryRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              {/* Company Size */}
              <div className="filter-group">
                <label className="filter-label">
                  <FiGlobe />
                  {t('search.companySize')}
                </label>
                <select
                  value={filters.companySize}
                  onChange={(e) => updateFilter('companySize', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('common.allSizes')}</option>
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Industry */}
              <div className="filter-group">
                <label className="filter-label">
                  <FiBriefcase />
                  {t('search.industry')}
                </label>
                <select
                  value={filters.industry}
                  onChange={(e) => updateFilter('industry', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('common.allIndustries')}</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="filter-group">
                <label className="filter-label">
                  <FiCalendar />
                  {t('search.dateRange')}
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => updateFilter('dateRange', e.target.value)}
                  className="filter-select"
                >
                  <option value="">{t('common.allTime')}</option>
                  {dateRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Boolean Filters */}
            <div className="boolean-filters">
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="hasCamera"
                  checked={filters.hasCamera}
                  onChange={() => toggleFilter('hasCamera')}
                />
                <label htmlFor="hasCamera">{t('search.hasCamera')}</label>
              </div>
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="canTravel"
                  checked={filters.canTravel}
                  onChange={() => toggleFilter('canTravel')}
                />
                <label htmlFor="canTravel">{t('search.canTravel')}</label>
              </div>
            </div>

            {/* Sort Options */}
            <div className="sort-options">
              <label className="filter-label">{t('search.sortBy')}:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="filter-select"
              >
                <option value="relevance">{t('search.relevance')}</option>
                <option value="date">{t('search.date')}</option>
                <option value="name">{t('search.name')}</option>
                <option value="location">{t('search.location')}</option>
                <option value="salary">{t('search.salary')}</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) => updateFilter('sortOrder', e.target.value)}
                className="filter-select"
              >
                <option value="desc">{t('search.descending')}</option>
                <option value="asc">{t('search.ascending')}</option>
          </select>
            </div>

            {/* Filter Actions */}
            <div className="filter-actions">
              <button type="button" onClick={clearFilters} className="clear-filters-button">
                {t('search.clearFilters')}
          </button>
        </div>
          </div>
        )}
      </form>

      {/* Search Results */}
      <div className="search-results">
        {isLoading ? (
          <div className="loading-results">
            <div className="loading-spinner"></div>
            <p>{t('search.searching')}</p>
          </div>
        ) : Object.keys(results).length > 0 ? (
          <div className="results-container">
            {/* Journalists Results */}
            {results.journalists && results.journalists.length > 0 && (
              <div className="results-section">
                <h3>{t('search.journalists')} ({results.journalists.length})</h3>
                <div className="results-grid">
                  {results.journalists.map(journalist => (
                    <div key={journalist.id} className="result-card">
                      <h4>{journalist.name}</h4>
                      <p><FiMapPin /> {journalist.country || journalist.cityOfResidence}</p>
                      <p><FiBriefcase /> {journalist.mediaWorkType}</p>
                      <p>{t('search.experience')}: {journalist.experienceLevel}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jobs Results */}
            {results.jobs && results.jobs.length > 0 && (
              <div className="results-section">
                <h3>{t('search.jobs')} ({results.jobs.length})</h3>
                <div className="results-grid">
                  {results.jobs.map(job => (
                    <div key={job.id} className="result-card">
                      <h4>{job.title}</h4>
                      <p><FiBriefcase /> {job.company?.name}</p>
                      <p><FiMapPin /> {job.locations?.[0]?.city || 'Remote'}</p>
                      <p><FiDollarSign /> {job.salary?.min}-{job.salary?.max}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Companies Results */}
            {results.companies && results.companies.length > 0 && (
              <div className="results-section">
                <h3>{t('search.companies')} ({results.companies.length})</h3>
                <div className="results-grid">
                  {results.companies.map(company => (
                    <div key={company.id} className="result-card">
                      <h4>{company.name}</h4>
                      <p><FiBriefcase /> {company.industry}</p>
                      <p><FiGlobe /> {company.size} {t('search.employees')}</p>
                      <p><FiMapPin /> {company.country || company.city}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Content Results */}
            {results.mediaContent && results.mediaContent.length > 0 && (
              <div className="results-section">
                <h3>{t('search.mediaContent')} ({results.mediaContent.length})</h3>
                <div className="results-grid">
                  {results.mediaContent.map(media => (
                    <div key={media.id} className="result-card">
                      <h4>{media.title}</h4>
                      <p><FiCamera /> {media.mediaType}</p>
                      <p><FiDollarSign /> {media.price}</p>
                      <p><FiMapPin /> {media.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : searchTerm && (
          <div className="no-results">
            <p>{t('search.noResults', { term: searchTerm })}</p>
            <p>{t('search.tryAgain')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
