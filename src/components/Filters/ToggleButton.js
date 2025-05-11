import React from 'react';
import styles from './ToggleButton.module.css';

const ToggleButton = ({ isActive, onClick, label }) => {
  
  
  return (
    <button
      type="button" 
      className={`${styles.toggleButton} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      aria-pressed={isActive} 
    >
      {label}
    </button>
  );
};

export default ToggleButton;