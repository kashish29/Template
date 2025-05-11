import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';

import DateRangePicker from './DateRangePicker';
import Dropdown from './Dropdown';
import ToggleButton from './ToggleButton';
import TextInput from './TextInput';
import MultiSelect from './MultiSelect'; 


const FilterBar = ({ config, onFiltersChange, hardcodedData, getNestedValue }) => {
  const filterConfiguration = config || []; 

  
  const [filters, setFilters] = useState(() => {
    const initialFilters = {};
    filterConfiguration.forEach(item => {
      if (item.type === 'multiSelect') {
        initialFilters[item.id] = item.defaultValue || [];
      } else if (item.type === 'dateRange') {
        
        initialFilters[item.id_start || `${item.id}_start`] = item.defaultValue?.start || '';
        initialFilters[item.id_end || `${item.id}_end`] = item.defaultValue?.end || '';
      }
      else {
        initialFilters[item.id] = item.defaultValue !== undefined ? item.defaultValue : '';
      }
    });
    return initialFilters;
  });

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value, 
    }));
  };

  const handleToggle = (filterId) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterId]: !prevFilters[filterId],
    }));
  };

  const handleDateChange = (filterIdStart, filterIdEnd, startDate, endDate) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterIdStart]: startDate,
      [filterIdEnd]: endDate,
    }));
  };

  const renderFilterItem = (item) => {
    const { key: itemKey, ...restCommonProps } = { // Destructure key and rename to avoid conflict
      key: item.id,
      label: item.label,
      name: item.id,
    };


    const dateStartKey = item.id_start || `${item.id}_start`;
    const dateEndKey = item.id_end || `${item.id}_end`;

    switch (item.type) {
      case 'dateRange':
        return (
          <DateRangePicker
            key={itemKey}
            {...restCommonProps}
            startDate={filters[dateStartKey]}
            endDate={filters[dateEndKey]}
            onStartDateChange={(e) => handleDateChange(dateStartKey, dateEndKey, e.target.value, filters[dateEndKey])}
            onEndDateChange={(e) => handleDateChange(dateStartKey, dateEndKey, filters[dateStartKey], e.target.value)}
          />
        );
      case 'dropdown':
        return (
          <Dropdown
            key={itemKey}
            {...restCommonProps}
            options={getNestedValue(hardcodedData, item.optionsKey) || []}
            value={filters[item.id]}
            onChange={handleChange}
          />
        );
      case 'toggle':
        return (
          <div className={styles.toggleWrapper} key={itemKey}>
            {item.label && <span className={styles.toggleLabel}>{item.label}</span>}
            <ToggleButton
              // key is already handled by the wrapper div for toggle, or pass itemKey if preferred directly on ToggleButton
              isActive={filters[item.id]}
              onClick={() => handleToggle(item.id)}
              label={item.buttonLabel || "Toggle"}
            />
          </div>
        );
      case 'textInput':
        return (
          <TextInput
            key={itemKey}
            {...restCommonProps}
            value={filters[item.id]}
            onChange={handleChange}
            placeholder={item.placeholder}
          />
        );
      case 'multiSelect':
        return (
          <MultiSelect
            key={itemKey}
            {...restCommonProps}
            options={getNestedValue(hardcodedData, item.optionsKey) || []}
            selectedValues={filters[item.id] || []}
            onChange={handleChange}
          />
        );
      default:
        return <p key={itemKey}>Unknown filter type: {item.type}</p>;
    }
  };

  if (!filterConfiguration.length) {
    return null; 
  }

  return (
    <div className={styles.filterBar}>
      {filterConfiguration.map(renderFilterItem)}
    </div>
  );
};
export default FilterBar;