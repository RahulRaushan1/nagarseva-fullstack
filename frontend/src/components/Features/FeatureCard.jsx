import React from 'react'
import styles from './Feature.module.css'

const FeatureCard = (props) => {
  return (

        <div className={styles.feature_card}>

            <div className={styles.feature_icon}>
                {props.logo}
            </div>

            <h3>
               {props.title}
            </h3>

            <p>
                {props.description}
            </p>

            {props.children}

        </div>
  )
}

export default FeatureCard
