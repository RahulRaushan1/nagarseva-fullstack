import React from 'react'
import styles from './complaintDetails.module.css';
import AvatarInitials from '../AvatarInitials/AvatarInitials';

const OfficerCard = ({title, officer, assignOfficerActionButton}) => {

    return (
  <div className={styles.card}>
    <div className={styles.card_header}>
      <h3 className={styles.card_title}>{title}</h3>
      {assignOfficerActionButton}
    </div>
    <div className={styles.card_body}>
      {officer ? (
        <div className={styles.officer_profile}>
          <AvatarInitials name={officer.officerName || officer.name} size={40} className={styles.officer_avatar} />
          <div className={styles.officer_details}>
            <h4 className={styles.officer_name}>{officer.officerName}</h4>
            <p className={styles.officer_dept}>{officer.officerDepartment || 'Nodal Officer'}</p>
          </div>
          <div className={styles.officer_status}>
            <span
              className={
                officer.active
                  ? styles.status_dot_active
                  : styles.status_dot_inactive
              }
            ></span> {officer.active === true ? 'Active' : 'Disabled'}
          </div>
        </div>
      ) : (
        <div className={styles.empty_state}>
          <div className={styles.empty_icon}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p>No officer assigned to this complaint yet.</p>
        </div>
      )}
    </div>
  </div>
);
}

export default OfficerCard
