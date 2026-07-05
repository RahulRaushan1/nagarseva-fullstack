import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import styles from "./workCompletionModal.module.css";

const WorkCompletionModal = ({ complaint, onClose, onSuccess, setLoading, setLoaderText }) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setImages((prev) => [...prev, ...files]);
    
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]); // Free memory
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (images.length === 0) return;
    setIsSubmitting(true);

    setLoaderText("Submitting complaint...")
    const loaderId = setTimeout(() => setLoading(true),300)

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));

      if (remark.trim().length != 0) {
        formData.append("remark", remark.trim());
      }

      const response = await fetch(
        `https://nagarseva-backend-oy56.onrender.com/officer/complaint/${complaint.complaintId}/finish`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        return
        // throw new Error(errorData.message || "Failed to submit work completion");
      }

      const data = await response.json();
      toast.success(data.message || "Work completed successfully");
      onSuccess();
      // onClose(); // Close modal and refresh data
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false)
      clearTimeout(loaderId)
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className={styles.modal_overlay} onClick={!isSubmitting ? onClose : undefined}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_header}>
          <div className={styles.header_text}>
            <h2 className={styles.modal_title}>Submit Work Completion</h2>
            <p className={styles.modal_subtitle}>Upload proof images and remarks before completing this complaint.</p>
          </div>
          <button className={styles.btn_close} onClick={onClose} disabled={isSubmitting}>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.modal_body}>
          {/* Image Upload Area */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Proof Images <span style={{color: "#ef4444"}}>*</span></label>
            <div 
              className={styles.upload_area} 
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className={styles.upload_icon} viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <div>
                <p className={styles.upload_text}>Click to upload images</p>
                <p className={styles.upload_subtext}>PNG, JPG, JPEG up to 5MB</p>
              </div>
            </div>
            <input 
              type="file"
              ref={fileInputRef}
              className={styles.hidden_input}
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />

            {previews.length > 0 && (
              <div className={styles.previews_grid}>
                {previews.map((preview, idx) => (
                  <div key={idx} className={styles.preview_container}>
                    <img src={preview} alt={`Preview ${idx + 1}`} className={styles.preview_img} />
                    <button 
                      className={styles.btn_remove_img} 
                      onClick={() => removeImage(idx)}
                      title="Remove image"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Remarks Section */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Remarks (Optional)</label>
            <textarea 
              className={styles.form_textarea}
              placeholder="Add work completion remarks..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.modal_footer}>
          <button 
            className={styles.btn_cancel} 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className={styles.btn_submit}
            onClick={handleSubmit}
            disabled={images.length === 0 || isSubmitting}
          >
            {isSubmitting && <div className={styles.loader_small}></div>}
            Submit Completion
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WorkCompletionModal;
