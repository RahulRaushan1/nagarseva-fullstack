import React, { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import styles from "./changePriorityModal.module.css";

const ChangePriorityModal = ({
  isOpen,
  onClose,
  complaint,
  setLoading,
  setLoaderText,
  refreshComplaintDetails,
  refreshComplaintList,
}) => {
  const [priority, setPriority] = useState(complaint?.priority || "MEDIUM");

  if (!isOpen || !complaint) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoaderText("Updating priority...");
    const loaderId = setTimeout(() => setLoading((true),300))

    try {
      const response = await fetch(
        `http://https://nagarseva-backend-oy56.onrender.com/councillor/complaint/${complaint.complaintId}?priority=${priority}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update complaint priority");
        return;
      }

      const data = await response.json();
      toast.success(data.message || "Priority updated successfully");

      await refreshComplaintDetails(complaint.complaintId);
      refreshComplaintList();
      onClose();
    } catch (err) {
      toast.error("Unable to connect to server");
      console.error(err);
    } finally {
      setLoading(false)
      clearTimeout(loaderId)
    }
  };

  const formattedDate = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return createPortal(
    <div className={styles.modal_overlay} onClick={handleBackdropClick}>
      <div className={styles.modal_content}>
        <div className={styles.modal_header}>
          <div className={styles.header_text}>
            <h3 className={styles.modal_title}>Update Complaint Priority</h3>
            <p className={styles.modal_subtitle}>
              Adjust the complaint priority based on urgency and civic impact.
            </p>
          </div>
          <button className={styles.btn_close} onClick={onClose} >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modal_body}>
            {/* Complaint Info Section */}
            <div className={styles.summary_card}>
              <div className={styles.summary_item}>
                <span className={styles.summary_label}>Complaint ID</span>
                <span className={styles.summary_value}>#{complaint.complaintId}</span>
              </div>
              <div className={styles.summary_item}>
                <span className={styles.summary_label}>Created At</span>
                <span className={styles.summary_value}>{formattedDate}</span>
              </div>
              <div className={styles.summary_item_full}>
                <span className={styles.summary_label}>Title</span>
                <span className={styles.summary_value}>{complaint.title || "Untitled Complaint"}</span>
              </div>
            </div>

            {/* Priority Selection */}
            <div className={styles.form_group}>
              <label className={styles.form_label} htmlFor="priority-select">
                Select Priority
              </label>
              <select
                id="priority-select"
                className={styles.form_select}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                // disabled={submitting}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div className={styles.modal_footer}>
            <button
              type="button"
              className={styles.btn_cancel}
              onClick={onClose}
              // disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btn_submit}
              // disabled={submitting}
            >Change Priority
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ChangePriorityModal;
