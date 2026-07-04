import React from 'react'
import styles from './complaintDetails.module.css';

const RemarksCard = ({ remarks, contactDetails }) => (
  <div className={styles.card}>
    <div className={styles.card_header}>
      <h3 className={styles.card_title}>Remarks</h3>
    </div>
    <div className={styles.card_body}>
      <div className={styles.empty_state}>
        <p>{remarks ? remarks : "no remarks"}</p>
      </div>
    </div>
  </div>
);

export default RemarksCard
