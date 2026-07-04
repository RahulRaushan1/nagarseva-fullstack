import React from "react";
import styles from "./ComplaintCard.module.css";

const ComplaintCard = ({
  id,
  date,
  title,
  category,
  ward,
  priority,
  status,
  onViewDetails,
  onEditComplaint,
  buttonPlaceholder,
}) => {
  return (
    <div className={styles.complaint_card}>
      <div className={styles.card_top}>
        <span className={styles.complaint_id}>#NS-{id}</span>
        <span className={styles.created_at}>
          {new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <h3 className={styles.card_title}>{title}</h3>

      <div className={styles.card_tags}>
        <span className={`${styles.pill} ${styles.pill_neutral}`}>
          {category}
        </span>
        <span className={`${styles.pill} ${styles.pill_ward}`}>
          Ward {ward}
        </span>
      </div>

      <div className={styles.card_status_row}>
        {/* We dynamically pick priority class priority_low, priority_medium, priority_high etc based on prop */}
        <span className={`${styles.pill} ${styles[`priority_${priority.toLowerCase()}`]}`}>{priority}</span>
        <span className={`${styles.pill} ${styles[`status_${status.toLowerCase()}`]}`}>{status}</span>
      </div>

      <hr className={styles.card_divider} />

      <div className={styles.card_actions}>
        <button
          className={`${styles.btn} ${styles.btn_view}`}
          onClick={() => onViewDetails(id)}
        >
          View Details
        </button>
        {buttonPlaceholder && 
        <button
          className={`${styles.btn} ${styles.btn_update}`}
          disabled={status != 'CREATED'}
          title={
            status !== "CREATED"
              ? "Complaint is Already Approved by Administartion"
              : ""
          }
          onClick={() => onEditComplaint(id)}
        >{buttonPlaceholder}
        </button>
}
      </div>
    </div>
  );
};

export default ComplaintCard;
