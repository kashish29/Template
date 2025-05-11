import React from 'react';
import styles from './DateRangePicker.module.css';

const DateRangePicker = ({ label, startDate, endDate, onStartDateChange, onEndDateChange, name }) => {
  return (
    <div className={styles.dateRangePickerContainer}>
      {label && <label className={styles.label}>{label}:</label>}
      <div className={styles.inputsWrapper}>
        <input
          type="date"
          value={startDate}
          onChange={onStartDateChange}
          className={styles.input}
        />
        <span className={styles.separator}>to</span>
        <input
          type="date"
          value={endDate}
          onChange={onEndDateChange}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;