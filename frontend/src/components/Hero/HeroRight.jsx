import React, { useState } from 'react'
import styles from './Hero.module.css'

const HeroRight = () => {

    const [complaint, setComplaint] = useState("1,293");
    const [resolved, setResolved] = useState("1,293")
  return (
    <div className={styles.hero_right}>

        <div className={styles.hero_dashboard_card}>

            <div className={styles.stats_row}>

                <div className={styles.stat_card}>
                    <p className={styles.stat_title}>Complaints</p>
                    <h2>{complaint}</h2>
                    <span className={styles.stat_green}>
                        +12%
                    </span>
                </div>

                <div className={styles.stat_card}>
                    <p className={styles.stat_title}>Resolved</p>
                    <h2>87%</h2>
                    <span className={styles.stat_green}>
                        +8%
                    </span>
                </div>

            </div>

            <div className={styles.recent_card}>

                <div className={styles.recent_header}>
                    <h3>Recent Complaints</h3>
                </div>

                <div className={styles.complaint_item}>

                    <div>
                        <p className={styles.complaint_title}>
                            Water Leakage
                        </p>

                        <span className={styles.complaint_location}>
                            Ward 12
                        </span>
                    </div>

                    <span className={`${styles.status} ${styles.pending}`}>
                        Pending
                    </span>

                </div>

                <div className={styles.complaint_item}>

                    <div>
                        <p className={styles.complaint_title}>
                            Garbage Overflow
                        </p>

                        <span className={styles.complaint_location}>
                            Market Area
                        </span>
                    </div>

                    <span className={`${styles.status} ${styles.progress}`}>
                        In Progress
                    </span>

                </div>

                <div className={styles.complaint_item}>

                    <div>
                        <p className={styles.complaint_title}>
                            Streetlight Issue
                        </p>

                        <span className={styles.complaint_location}>
                            Sector 9
                        </span>
                    </div>

                    <span className={`${styles.status} ${styles.resolved}`}>
                        Resolved
                    </span>

                </div>

            </div>

            <div className={styles.analytics_card}>

                <div className={styles.analytics_top}>

                    <h3>Weekly Reports</h3>

                    <span>
                        2.4k
                    </span>

                </div>

                <div className={styles.bars}>

                    <div className={`${styles.bar} ${styles.small}`}></div>
                    <div className={`${styles.bar} ${styles.medium}`}></div>
                    <div className={`${styles.bar} ${styles.large} ${styles.active}`}></div>
                    <div className={`${styles.bar} ${styles.medium}`}></div>
                    <div className={`${styles.bar} ${styles.small}`}></div>

                </div>

            </div>

        </div>

    </div>
  )
}

export default HeroRight
