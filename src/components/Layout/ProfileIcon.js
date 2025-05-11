// src/components/Layout/ProfileIcon.js
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import styles from './ProfileIcon.module.css';

const ProfileIcon = () => {
  const { toggleProfileDrawer, hardcodedData, getNestedValue } = useAppContext();
  const userProfile = getNestedValue(hardcodedData, 'userProfile') || {};
  const avatarUrl = userProfile.avatarUrl;
  const userName = userProfile.name;

  return (
    <div className={styles.profileIconContainer} onClick={toggleProfileDrawer} title="Open Profile">
      {avatarUrl ? (
        <img src={avatarUrl} alt={userName || 'Profile'} className={styles.avatarImage} />
      ) : (
        <div className={styles.defaultAvatar}>
          {userName ? userName.charAt(0).toUpperCase() : 'P'}
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;