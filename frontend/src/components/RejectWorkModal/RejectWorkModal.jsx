import React, { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./rejectWorkModal.module.css";
import { toast } from "react-toastify";

const RejectWorkModal = ({
  isOpen,
  onClose,
  complaintId,
  refreshComplaintDetails,
  refreshComplaintList,
  handleRejectWork,
  setLoaderText,
  setLoading
}) => {
  const [contactDetails, setContactDetails] = useState("");
  const [remark, setRemarks] = useState("");
  // const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contactDetails.trim()) {
      toast.error("Please provide your contact details")
      return;
    }

    if (!remark.trim()) {
      toast.error("Please provide remark");
      return;
    }

    console.log("trigger 1")

    setLoaderText("Processing your rejection...")
    const loaderId = setTimeout(() => setLoading(true),300)

    try {
      const response = await fetch(
        `http://localhost:8080/citizen/complaint/${complaintId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            contactDetails,
            remark,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        toast.error(errorData.message || "Something went wrong");
        return;
      }

      const data = await response.json();

      toast.success(data.message);

      await refreshComplaintDetails(complaintId);
      refreshComplaintList();
      
      setContactDetails("");
      setRemarks("");

      onClose();
    } catch (err) {
      toast.error("Unable to connect to server");
      console.log(err);
    } finally {
      setLoading(false);
      clearTimeout(loaderId)
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button
          className={styles.close_button}
          onClick={onClose}
          // disabled={loading}
        >
          ✕
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Request Rework</h2>

          <p className={styles.subtitle}>
            Let us know what is still unresolved so the officer can continue the work.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label className={styles.label}>Contact Details</label>

            <input
              type="text"
              className={styles.input_field}
              placeholder="Enter contact details for follow-up"
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              // disabled={loading}
            />
          </div>

          <div className={styles.form_group}>
            <label className={styles.label}>Remarks</label>

            <textarea
              className={styles.textarea_field}
              placeholder="Describe what issue still remains unresolved..."
              value={remark}
              onChange={(e) => setRemarks(e.target.value)}
              // disabled={loading}
              rows={5}
            />
          </div>

          <div className={styles.button_group}>
            <button
              type="button"
              className={styles.btn_cancel}
              onClick={onClose}
              // disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.btn_primary}
              disabled={!remark.trim()}
            >Submit Rework Request
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default RejectWorkModal;