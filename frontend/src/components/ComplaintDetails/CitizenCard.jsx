import React from 'react'
import styles from './complaintDetails.module.css';

const CitizenCard = ({ citizen }) => (
  <div className={styles.card}>
    <div className={styles.card_header}>
      <h3 className={styles.card_title}>Citizen Information</h3>
    </div>
    <div className={styles.card_body}>
      <div className={styles.info_grid}>
        <div className={styles.info_item}>
          <span className={styles.info_label}>Name</span>
          <span className={styles.info_value}>{citizen?.citizenName || 'N/A'}</span>
        </div>
        <div className={styles.info_item}>
          <span className={styles.info_label}>Citizen Ward</span>
          <span className={styles.info_value}>{citizen?.citizenWard || 'N/A'}</span>
        </div>
        <div className={styles.info_item}>
          <span className={styles.info_label}>Email</span>
          <span className={styles.info_value}>{citizen?.citizenEmail || 'N/A'}</span>
        </div>
      </div>
    </div>
  </div>
);

export default CitizenCard
