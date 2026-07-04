import React, { useState, useRef, useEffect } from "react";
import styles from "./editComplaint.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditComplaint = ({ complaint, ward, onCancel, setLoading, setLoaderText }) => {
  const [title, setTitle] = useState(complaint?.title || "");
  const [issueType, setIssueType] = useState(complaint?.issueType || "");
  const [description, setDescription] = useState(complaint?.description || "");
  const [wardId, setWardId] = useState(complaint?.wardId || "");
  const [existingImages, setExistingImages] = useState(complaint?.images || []);
  const [newImages, setNewImages] = useState([]);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const issueTypes = [
    "SANITATION",
    "WATER",
    "ELECTRICITY",
    "ROADS",
    "DRAINAGE",
    "OTHER",
  ];

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const mappedImages = newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setNewImages((prev) => [...prev, ...mappedImages]);
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const isDescriptionValid =
    description.length === 0 ||
    (description.length >= 10 && description.length <= 200);

  const isFormValid =
    title.trim() &&
    issueType &&
    description.length >= 10 &&
    description.length <= 200;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoaderText("Updating Complaint...");
    
    // Setup FormData for PUT/PATCH request
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("wardId", wardId);
    formdata.append("issueType", issueType);
    formdata.append("desc", description);

    // If API expects a list of existing images to keep or delete,
    // we append them. This assumes API expects remaining image URLs as JSON or separated list.
    // Replace this logic with your specific backend requirements:
    formdata.append("existingImages", JSON.stringify(existingImages));

    // Append new uploaded images
    newImages.forEach((img) => formdata.append("images", img.file));

    const loaderTimeout = setTimeout(() => setLoading(true), 300);

    try {
      const response = await fetch(`http://localhost:8080/citizen/complaint/${complaint.complaintId}`, {
        method: "PUT", // Assuming PUT for updating
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formdata,
      });

      if (!response.ok) {
        if (response.status === 401) navigate("/login");
        const errorData = await response.json();
        console.log(errorData);
        toast.error("Failed to update complaint");
        return;
      }

      const data = await response.json();
      toast.success("Complaint updated successfully!");
      onCancel(); // Trigger back or refresh
    } catch (err) {
      toast.error("Unable to connect to server.");
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
  };

  return (
    <div className={styles.page_container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button onClick={onCancel} className={styles.btn_back} type="button">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
          <div className={styles.header_content}>
            <h2 className={styles.title}>Edit Complaint</h2>
            <p className={styles.subtitle}>
              Update your complaint details and attachments.
            </p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="title" className={styles.label}>
              Complaint Title
            </label>
            <input
              type="text"
              id="title"
              className={styles.input_field}
              placeholder="Enter complaint title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label htmlFor="issueType" className={styles.label}>
                Issue Type
              </label>
              <select
                id="issueType"
                className={styles.input_field}
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Issue Type
                </option>
                {issueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.form_group}>
              <label htmlFor="ward" className={styles.label}>
                Ward Selection
                <span className={styles.optional_text}>(Optional)</span>
              </label>
              <select
                id="ward"
                className={styles.input_field}
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
              >
                <option value="">Your Ward (Default)</option>
                {ward?.map((w) => (
                  <option key={w.wardId} value={w.wardId}>
                    Ward {w.wardId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              className={`${styles.input_field} ${styles.textarea_field}`}
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <span
              className={`${styles.helper_text} ${!isDescriptionValid ? styles.error : ""}`}
            >
              {description.length > 0
                ? `${description.length}/200 characters`
                : "Description must be between 10–200 characters."}
            </span>
          </div>

          <div className={styles.attachments_section}>
            {existingImages?.length > 0 && (
              <div className={styles.form_group}>
                <h4 className={styles.section_label}>Existing Attachments</h4>
                <div className={styles.image_previews}>
                  {existingImages.map((img, idx) => (
                    <div key={`existing-${idx}`} className={styles.image_preview_box}>
                      <img src={img} alt={`Existing Attachment ${idx}`} className={styles.preview_img} />
                      <button
                        type="button"
                        className={styles.remove_image_btn}
                        onClick={() => removeExistingImage(idx)}
                        title="Remove image"
                      >
                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.form_group}>
              <label className={styles.section_label}>
                Upload New Images <span className={styles.optional_text}>(Optional)</span>
              </label>

              <div
                className={styles.upload_area}
                onClick={() => fileInputRef.current.click()}
              >
                <div className={styles.upload_icon}>
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div>
                  <span className={styles.upload_text}>Click to upload</span>
                  <p className={styles.upload_subtext}>
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className={styles.file_input}
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                />
              </div>

              {newImages.length > 0 && (
                <div className={styles.image_previews}>
                  {newImages.map((img, idx) => (
                    <div key={`new-${idx}`} className={styles.image_preview_box}>
                      <img
                        src={img.preview}
                        alt={`New Preview ${idx}`}
                        className={styles.preview_img}
                      />
                      <button
                        type="button"
                        className={styles.remove_image_btn}
                        onClick={() => removeNewImage(idx)}
                        title="Remove image"
                      >
                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className={styles.card_divider} />

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btn_cancel}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btn_primary}
              disabled={!isFormValid}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditComplaint;
