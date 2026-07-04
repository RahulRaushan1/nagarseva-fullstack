import React from "react";
import styles from "./complaintDetails.module.css";

const Header = ({ complaint, onBack, actionButton }) => {
  return (
    <div className={styles.header}>
      <button onClick={onBack} className={styles.btn_back}>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Complaints
      </button>
      <div className={styles.header_main}>
        <div className={styles.header_content}>
          <h2 className={styles.page_title}>
            {complaint.title || "Untitled Complaint"}
          </h2>
          <div className={styles.metadata_row}>
            <span className={styles.metadata_item}>
              Complaint #{complaint.complaintId || "ID"}
            </span>
            <span className={styles.dot_separator}>•</span>
            <span
              className={`${styles.status_pill} ${styles[complaint.issueStatus?.toLowerCase() || "pending"]}`}
            >
              {complaint.issueStatus || "PENDING"}
            </span>
            <span className={styles.dot_separator}>•</span>
            <span className={styles.metadata_item}>
              {complaint.createdAt
                ? new Date(complaint.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
        </div>

        {actionButton && (
          <div className={styles.header_action}>{actionButton}</div>
        )}
      </div>
    </div>
  );
};

export default Header;
