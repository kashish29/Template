// src/components/Layout/TopBar.js
import React from 'react';
import ProfileIcon from './ProfileIcon'; 
import styles from './TopBar.module.css'; 

const TopBar = () => {
  return (
    <header className={styles.topBar}>
      <h1 className={styles.title}>My App</h1>
      
      <ProfileIcon />
    </header>
  );
};
export default TopBar;