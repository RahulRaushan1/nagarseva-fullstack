import React, { useState } from "react";
import styles from "./complaintDetails.module.css";

const CycleHistoryCard = ({ cycle }) => {
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  if (!cycle) return null;

  // Format timestamp helper
  const formatTimestamp = (timestampString) => {
    if (!timestampString) return "";
    try {
      const date = new Date(timestampString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return timestampString;
    }
  };

  const cycleNumber = cycle.cycleNumber + 1; // 1-based index for user readability
  const images = cycle.completionImages || [];
  const officerRemarks = cycle.officerRemarks;
  const citizenRemarks = cycle.citizenRemarks;
  const citizenContactDetails = cycle.citizenContactDetails;
  const submittedAt = cycle.submittedAt;

  return (
    <div className={styles.previous_cycle_card}>
      {/* Header Row */}
      <div className={styles.previous_cycle_header}>
        <div className={styles.previous_cycle_title_wrapper}>
          <span className={styles.previous_cycle_num}>Attempt #{cycleNumber}</span>
          {submittedAt && (
            <span className={styles.previous_cycle_time}>
              Submitted on {formatTimestamp(submittedAt)}
            </span>
          )}
        </div>
        <span className={styles.rejected_badge}>Rejected By Citizen</span>
      </div>

      {/* Compact Layout */}
      <div className={styles.previous_cycle_layout}>
        {/* Left Side: Images */}
        <div className={styles.previous_cycle_left_col}>
          <h5 className={styles.section_title_tiny}>Officer Completion Images</h5>
          {images.length > 0 ? (
            <div className={styles.previous_cycle_image_grid}>
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={styles.previous_cycle_img_container}
                  onClick={() => setActiveLightboxImg(img.url)}
                >
                  <img
                    src={img.url}
                    alt={`Previous Attempt ${idx + 1}`}
                    className={styles.previous_cycle_attached_img}
                  />
                  <div className={styles.image_hover_overlay_small}>
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.previous_cycle_empty_state}>
              <p>No completion images uploaded.</p>
            </div>
          )}
        </div>

        {/* Right Side: Remarks & Details */}
        <div className={styles.previous_cycle_right_col}>
          <div className={styles.remarks_row}>
            <div className={styles.remark_item}>
              <h5 className={styles.section_title_tiny}>Officer Remarks</h5>
              <div className={styles.previous_cycle_remarks_box}>
                {officerRemarks?.trim() ? officerRemarks : "N/A"}
              </div>
            </div>

            {citizenRemarks && (
              <div className={styles.remark_item}>
                <h5 className={styles.section_title_tiny} style={{ color: "#dc2626" }}>Citizen Rejection Remarks</h5>
                <div className={`${styles.previous_cycle_remarks_box} ${styles.previous_rejection_box}`}>
                  {citizenRemarks}
                </div>
              </div>
            )}
          </div>

          {citizenContactDetails && (
            <div className={styles.previous_contact_section}>
              <h5 className={styles.section_title_tiny}>Citizen Contact Details</h5>
              <div className={styles.previous_cycle_contact_box}>
                {citizenContactDetails}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Lightbox Overlay */}
      {activeLightboxImg && (
        <div 
          className={styles.lightbox} 
          onClick={() => setActiveLightboxImg(null)}
        >
          <button 
            className={styles.lightbox_close} 
            onClick={() => setActiveLightboxImg(null)}
          >
            ✕
          </button>
          <img 
            src={activeLightboxImg} 
            alt="Enlarged Completion Proof" 
            className={styles.lightbox_img} 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};

export default CycleHistoryCard;
