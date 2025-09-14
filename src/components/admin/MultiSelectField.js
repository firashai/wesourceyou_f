import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import './MultiSelectField.css';

const MultiSelectField = ({
  label,
  value = [],
  onChange,
  options = [],
  placeholder = "Type to add custom option...",
  maxItems = 10
}) => {
  const { t } = useLanguage();
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleOptionToggle = (option) => {
    const newValue = value.includes(option)
      ? value.filter(item => item !== option)
      : [...value, option];
    onChange(newValue);
  };

  const handleCustomAdd = () => {
    if (customValue.trim() && !value.includes(customValue.trim())) {
      const newValue = [...value, customValue.trim()];
      onChange(newValue);
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  const handleRemove = (itemToRemove) => {
    const newValue = value.filter(item => item !== itemToRemove);
    onChange(newValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomAdd();
    }
  };

  return (
    <div className="multi-select-field">
      <label>{label}</label>
      
      {/* Selected items display */}
      <div className="selected-items">
        {value.map((item, index) => (
          <div key={index} className="selected-item">
            <span>{item}</span>
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="remove-btn"
            >
              <FiX size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Options grid */}
      <div className="options-grid">
        {options.map((option) => (
          <label key={option} className="option-checkbox">
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => handleOptionToggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      {/* Custom input */}
      <div className="custom-input-section">
        {!showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="add-custom-btn"
            disabled={value.length >= maxItems}
          >
            <FiPlus size={14} />
            {t('common.addCustom')}
          </button>
        ) : (
          <div className="custom-input-container">
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="custom-input"
            />
            <button
              type="button"
              onClick={handleCustomAdd}
              className="add-btn"
              disabled={!customValue.trim()}
            >
              {t('common.add')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false);
                setCustomValue('');
              }}
              className="cancel-btn"
            >
              {t('common.cancel')}
            </button>
          </div>
        )}
      </div>

      {value.length >= maxItems && (
        <div className="max-items-warning">
          {t('common.maxItems', { count: maxItems })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectField;
