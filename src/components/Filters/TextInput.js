import React from 'react';
import styles from './TextInput.module.css';

const TextInput = ({ label, value, onChange, name, placeholder }) => {
  return (
    <div className={styles.textInputContainer}>
      {label && <label htmlFor={name} className={styles.label}>{label}:</label>}
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
};
export default TextInput;