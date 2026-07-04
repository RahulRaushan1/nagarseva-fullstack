import React from 'react';
import styles from './WardCard.module.css';

const WardCard = ({ wardId, wardName, wardCouncillor, handleAssignCouncillor, handleEditWard}) => {
  return (
    <div className={styles.ward_card}>
      <div className={styles.card_header}>
        <div className={styles.ward_info}>
          <h3 className={styles.ward_name}>{wardName}</h3>
          <span className={styles.ward_id_badge}>
            <i className="ph ph-map-pin"></i> Ward #{wardId}
          </span>
        </div>
      </div>

      <div className={styles.councillor_section}>
        <span className={styles.councillor_label}>Ward Councillor</span>
        {wardCouncillor ? (
          <span className={styles.councillor_value}>
            <i className="ph ph-user"></i> {wardCouncillor}
          </span>
        ) : (
          <span className={styles.not_available}>
            <i className="ph ph-warning-circle"></i> NOT AVAILABLE
          </span>
        )}
      </div>

      <hr className={styles.card_divider} />

      <div className={styles.card_footer}>
        <button className={styles.btn_assign} onClick={() => handleAssignCouncillor(wardId, wardName)}>
          {wardCouncillor? "Reassign Councillor" : "Assign councillor"} <i className="ph ph-arrow-right"></i>
        </button>
        <button className={styles.btn_view} onClick={() => handleEditWard(wardId, wardName)}>
          Edit Ward <i className="ph ph-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default WardCard;
