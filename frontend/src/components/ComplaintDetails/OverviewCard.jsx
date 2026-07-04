import React from 'react'
import styles from './complaintDetails.module.css';

const OverviewCard = ({ complaint }) => (
  <div className={styles.card}>
    <div className={styles.card_header}>
      <h3 className={styles.card_title}>Complaint Overview</h3>
    </div>
    <div className={styles.card_body}>
      <div className={styles.info_grid}>
        <div className={styles.info_item}>
          <span className={styles.info_label}>Title</span>
          <span className={styles.info_value}>{complaint.title || 'N/A'}</span>
        </div>
        <div className={styles.info_item}>
          <span className={styles.info_label}>Issue Type</span>
          <span className={styles.info_value}>{complaint.issueType || 'N/A'}</span>
        </div>
        <div className={styles.info_item}>
          <span className={styles.info_label}>Ward ID</span>
          <span className={styles.info_value}>{complaint.ward.wardId || 'N/A'}</span>
        </div>
        <div className={styles.info_item}>
          <span className={styles.info_label}>Priority</span>
          <span className={`${styles.badge} ${styles[complaint.priority?.toLowerCase() || 'medium']}`}>
            {complaint.priority || 'Medium'}
          </span>
        </div>
      </div>
      <div className={styles.info_item_full}>
        <span className={styles.info_label}>Description</span>
        <p className={styles.info_desc}>{complaint.description || 'No description provided.'}</p>
      </div>
    </div>
  </div>
);

export default OverviewCard
