import React from 'react'
import styles from './OfficerCard.module.css'

const OfficerStats = (props) => {
  return (
    <div className={styles.stats_grid}>
                <div className={styles.stat_box}>
                    <span className={styles.stat_value}>{props.activeComplaints}</span>
                    <span className={styles.stat_label}>Active</span>
                </div>
                <div className={styles.stat_box}>
                    <span className={styles.stat_value}>{props.resolvedComplaints}</span>
                    <span className={styles.stat_label}>Resolved</span>
                </div>
                <div className={styles.stat_box}>
                    <span className={styles.stat_value}>{props.pendingComplaints}</span>
                    <span className={styles.stat_label}>Pending</span>
                </div>
            </div>
  )
}

export default OfficerStats
