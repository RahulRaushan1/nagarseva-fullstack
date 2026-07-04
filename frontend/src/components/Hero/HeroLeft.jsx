import React from 'react'
import styles from './Hero.module.css'

const HeroLeft = () => {
  return (
      <div className={styles.heroLeft}>

        <p className={styles.heroTag}>
            Smart Civic Management Platform
        </p>

        <h1 className={styles.heroTitle}>
            Your Voice.
        </h1>
        <h1 className={styles.heroTitle}>
            Your City.
        </h1>
        <h1 className={styles.heroTitle}>
            Your Change.
        </h1>

        <p className={styles.heroDescription}>
            Report civic issues, track complaint progress, and stay connected
            with your local authorities through one unified platform.
        </p>

        <div className={styles.heroButtons}>

            <button className={styles.primaryBtn}>
                Raise Complaint
            </button>

            <button className={styles.secondaryBtn}>
                Track Status
            </button>

        </div>

    </div>
  )
}

export default HeroLeft
