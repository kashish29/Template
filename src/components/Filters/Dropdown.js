import React from 'react';
import styles from './Dropdown.module.css';

const Dropdown = ({ label, name, options, value, onChange }) => {
  return (
    <div className={styles.dropdownContainer}>
      {label && <label htmlFor={name} className={styles.label}>{label}:</label>}
      <select id={name} name={name} value={value} onChange={onChange} className={styles.select}>
        
        
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;