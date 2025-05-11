// src/components/Filters/MultiSelect.js (Basic Example)
import React from 'react';
import styles from './MultiSelect.module.css'; 

const MultiSelect = ({ label, name, options, selectedValues, onChange }) => {
  const handleChange = (optionValue) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange({ target: { name, value: newSelectedValues } });
  };

  return (
    <div className={styles.multiSelectContainer}>
      {label && <label className={styles.label}>{label}:</label>}
      <div className={styles.optionsContainer}>
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            className={`${styles.optionButton} ${selectedValues.includes(option.value) ? styles.selected : ''}`}
            onClick={() => handleChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
export default MultiSelect;