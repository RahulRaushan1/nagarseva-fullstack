import React from 'react'
import OfficerFooter from './OfficerFooter'
import OfficerStats from './OfficerStats'
import styles from './OfficerCard.module.css'
import AvatarInitials from '../AvatarInitials/AvatarInitials'

const OfficerCard = ({props}) => {

  return (
   <div className={styles.officer_card}>
            <div className={styles.card_header}>
                <div className={styles.officer_info}>
                    <AvatarInitials name={props.name} size={56} className={styles.officer_avatar} />
                    <div className={styles.officer_details}>
                        <h3 className={styles.officer_name}>{props.name}</h3>
                        <span className={styles.officer_dept}>{props.department}</span>
                    </div>
                </div>
            </div>

            <OfficerStats 
            activeComplaints=
            {props.activeComplaints == null ? 'N/A' : props.activeComplaints} 
            resolvedComplaints=
            {props.resolvedComplaints == null ? 'N/A' : props.resolvedComplaints} 
            pendingComplaints=
            {props.pendingComplaints == null ? 'N/A' : props.pendingComplaints}/>

            <hr className={styles.card_divider} />
            
            <OfficerFooter userId={props.id} currentStatus={props.active}/>

           </div> 
            

  )
}

export default OfficerCard
