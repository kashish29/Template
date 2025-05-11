import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import styles from './ProfileDrawer.module.css';
import { Link, useNavigate } from 'react-router-dom'; 

const UserInfoWidget = ({ data }) => (
  <div className={styles.userInfo}>
    {data.avatarUrl && <img src={data.avatarUrl} alt={data.name || 'User Avatar'} className={styles.avatar} />}
    <div className={styles.userDetails}>
      {data.name && <span className={styles.userName}>{data.name}</span>}
      {data.email && <span className={styles.userEmail}>{data.email}</span>}
    </div>
  </div>
);

const LinksGroupWidget = ({ title, links }) => (
  <div className={styles.linksGroup}>
    {title && <h4 className={styles.linksGroupTitle}>{title}</h4>}
    <ul className={styles.linksList}>
      {links.map((link, index) => (
        <li key={index}>
          <Link to={link.path} className={styles.linkItem}>{link.label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const ActionButtonWidget = ({ label, action, onClick }) => {
  const navigate = useNavigate();
  const handleAction = () => {
    if (action === 'logout') {
      console.log("Logout action triggered");
      navigate('/login'); 
    }
    if (onClick) onClick();
  };
  return (
    <button onClick={handleAction} className={styles.actionButton}>
      {label}
    </button>
  );
};

const DividerWidget = () => <hr className={styles.divider} />;


const ProfileDrawer = () => {
  const { isProfileDrawerOpen, toggleProfileDrawer, hardcodedData, getNestedValue } = useAppContext();
  const drawerConfig = getNestedValue(hardcodedData, 'profileDrawerConfig') || [];

  const renderWidget = (widget, index) => {
    const widgetData = widget.dataKey ? getNestedValue(hardcodedData, widget.dataKey) : widget.data;
    switch (widget.type) {
      case 'userInfo':
        return <UserInfoWidget key={index} data={widgetData || {}} />;
      case 'linksGroup':
        return <LinksGroupWidget key={index} title={widget.title} links={widget.links || []} />;
      case 'actionButton':
        return <ActionButtonWidget key={index} label={widget.label} action={widget.action} onClick={widget.action === 'close' ? toggleProfileDrawer : null} />;
      case 'divider':
        return <DividerWidget key={index} />;
      default:
        return <p key={index}>Unknown widget type: {widget.type}</p>;
    }
  };

  return (
    <>
      <div
        className={`${styles.profileDrawerOverlay} ${isProfileDrawerOpen ? styles.open : ''}`}
        onClick={toggleProfileDrawer}
      />
      <div className={`${styles.profileDrawer} ${isProfileDrawerOpen ? styles.open : ''}`}>
        <button onClick={toggleProfileDrawer} className={styles.closeButton}>×</button>
        <div className={styles.drawerContent}>
          {drawerConfig.map(renderWidget)}
        </div>
      </div>
    </>
  );
};
export default ProfileDrawer;