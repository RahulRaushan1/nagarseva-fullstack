import React, { useState } from "react";
import styles from "./complaintDetails.module.css";

const CurrentCycleCard = ({ cycle, status, complaintActionButtons }) => {
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

  const images = cycle.completionImages || [];
  const officerRemarks = cycle.officerRemarks;
  const citizenRemarks = cycle.citizenRemarks;
  const citizenContactDetails = cycle.citizenContactDetails;
  const submittedAt = cycle.submittedAt;

  return (
    <div className={styles.current_cycle_card}>
      {/* Top Header Row with Title and Badge */}
      <div className={styles.cycle_card_header}>
        <div className={styles.cycle_title_wrapper}>
          <h3 className={styles.card_title}>Work Completion Proof</h3>
          {submittedAt && (
            <span className={styles.cycle_timestamp}>
              Submitted on {formatTimestamp(submittedAt)}
            </span>
          )}
        </div>
        <span className={styles.current_submission_badge}>Current Submission</span>
      </div>

      <div className={styles.cycle_card_layout}>
        {/* Left Column: Images Grid */}
        <div className={styles.cycle_left_col}>
          <h4 className={styles.section_title_small}>Completion Images</h4>
          {images.length > 0 ? (
            <div className={styles.cycle_image_grid}>
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={styles.cycle_image_container}
                  onClick={() => setActiveLightboxImg(img.url)}
                >
                  <img
                    src={img.url}
                    alt={`Completion Proof ${idx + 1}`}
                    className={styles.cycle_attached_img}
                  />
                  <div className={styles.image_hover_overlay}>
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.cycle_empty_state}>
              <p>No completion images uploaded.</p>
            </div>
          )}
        </div>

        {/* Right Column: Remarks and Info */}
        <div className={styles.cycle_right_col}>
          <div className={styles.remarks_section}>
            <h4 className={styles.section_title_small}>Officer Remarks</h4>
            <div className={styles.cycle_remarks_box}>
              {officerRemarks?.trim() ? officerRemarks : "N/A"}
            </div>
          </div>

          {citizenRemarks && (
            <div className={styles.remarks_section} style={{ marginTop: "16px" }}>
              <h4 className={styles.section_title_small} style={{ color: "#dc2626" }}>Citizen Rejection Remarks</h4>
              <div className={`${styles.cycle_remarks_box} ${styles.rejection_box}`}>
                {citizenRemarks}
              </div>
            </div>
          )}

          {citizenContactDetails && (
            <div className={styles.contact_section} style={{ marginTop: "16px" }}>
              <h4 className={styles.section_title_small}>Citizen Contact Details</h4>
              <div className={styles.cycle_contact_box}>
                {citizenContactDetails}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons at Bottom Right */}
      {complaintActionButtons && (
        <div className={styles.cycle_action_buttons}>
          {complaintActionButtons}
        </div>
      )}

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

export default CurrentCycleCard;
