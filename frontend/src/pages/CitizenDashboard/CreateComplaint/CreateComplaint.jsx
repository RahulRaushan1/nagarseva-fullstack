import React, { useState, useRef } from "react";
import styles from "./createComplaint.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";

const CreateComplaint = ({ onCancel, ward, setLoading, setLoaderText, refreshComplaintList }) => {
  const [title, setTitle] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [wardId, setWardId] = useState("");
  const [images, setImages] = useState([]);
  const [isExiting, setIsExiting] = useState(false);
  const [locationMode, setLocationMode] = useState("coordinates"); // "coordinates" or "landmark"
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [landmark, setLandmark] = useState("");

  const getCurrentLocation = () => {
    setLoaderText("Accessing location...");
    const loadingId = setTimeout(() => setLoading(true), 300);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        clearTimeout(loadingId);
        setLoading(false);
        toast.success("Location coordinates captured successfully.");
      },
      (error) => {
        clearTimeout(loadingId);
        setLoading(false);
        toast.error("Unable to access your location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCancel = () => {
    setIsExiting(true);
  };

  const handleAnimationEnd = (e) => {
    if (isExiting && e.target.classList.contains(styles.page_container)) {
      onCancel();
    }
  };

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
      // Create local object URLs for preview
      const newImages = newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const isDescriptionValid =
    description.length === 0 ||
    (description.length >= 10 && description.length <= 200);

  const isLandmarkValid =
    landmark.length === 0 ||
    (landmark.length >= 5 && landmark.length <= 100);

  const isLocationValid =
    (locationMode === "coordinates" && latitude !== null && longitude !== null) ||
    (locationMode === "landmark" && landmark.trim().length >= 5 && landmark.trim().length <= 100);

  const isFormValid =
    title.trim() &&
    issueType &&
    description.length >= 10 &&
    description.length <= 200;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLocationValid) {
      toast.error("Please provide either your current location or a landmark.");
      return;
    }
    if (!isFormValid) return;

    setLoaderText("Creating Complaint...");

    const formdata = new FormData();

    formdata.append("title", title);
    formdata.append("wardId", wardId);
    formdata.append("issueType", issueType);
    formdata.append("desc", description);

    if (locationMode === "coordinates" && latitude !== null && longitude !== null) {
      formdata.append("latitude", latitude);
      formdata.append("longitude", longitude);
    } else if (locationMode === "landmark" && landmark) {
      formdata.append("landmark", landmark);
    }

    images.forEach((img) => formdata.append("images", img.file));

    // Debug 
    //     for (let pair of formdata.entries()) {
    //    console.log(pair[0], pair[1]);
    // }

    const loaderTimeout = setTimeout(() => setLoading(true), 300);

    try {
      const response = await fetch("https://nagarseva-backend-oy56.onrender.com/citizen/complaint", {
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formdata,
      });

      if (!response.ok) {

        if (response.status === 401) navigate("/login")
        const errorData = await response.json();

        console.log(errorData);
        return;
      }

      const data = await response.json();
      // console.log(data);
      toast.success(data.message)
      refreshComplaintList();
      handleCancel();
    } catch (err) {
      // console.log(err)
      toast.error("Unable to connect to server.")
    } finally {
      clearTimeout(loaderTimeout);
      setLoading(false);
    }
  };

  return (
    <div 
      className={`${styles.page_container} ${isExiting ? styles.fadeOut : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Complaint</h2>
          <p className={styles.subtitle}>
            Report civic issues in your locality and help improve your
            community.
          </p>
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
              // disabled={loading}
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
                // disabled={loading}
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
              // disabled={loading}
              >
                <option value="">Your Ward (Default)</option>
                {ward.map((w) => (
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
              // disabled={loading}
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

          {/* Location Details Section */}
          <div className={styles.location_section}>
            <div className={styles.section_header}>
              <h3 className={styles.section_title}>Location Details</h3>
              <p className={styles.section_subtitle}>
                Help authorities identify the exact location of the issue.
              </p>
            </div>

            <div className={styles.location_mode_container}>
              <div
                className={`${styles.mode_card} ${
                  locationMode === "coordinates" ? styles.mode_card_active : ""
                }`}
                onClick={() => setLocationMode("coordinates")}
              >
                <div className={styles.radio_indicator}>
                  {locationMode === "coordinates" && (
                    <span className={styles.radio_dot}></span>
                  )}
                </div>
                <div className={styles.mode_info}>
                  <span className={styles.mode_title}>Use Current Location 📍</span>
                </div>
              </div>

              <div
                className={`${styles.mode_card} ${
                  locationMode === "landmark" ? styles.mode_card_active : ""
                }`}
                onClick={() => setLocationMode("landmark")}
              >
                <div className={styles.radio_indicator}>
                  {locationMode === "landmark" && (
                    <span className={styles.radio_dot}></span>
                  )}
                </div>
                <div className={styles.mode_info}>
                  <span className={styles.mode_title}>Enter Landmark</span>
                </div>
              </div>
            </div>

            {locationMode === "coordinates" ? (
              <div className={styles.form_group}>
                <label className={styles.label}>Location Coordinates</label>
                {latitude !== null && longitude !== null ? (
                  <div className={styles.coordinates_success_box}>
                    <div className={styles.coordinates_text}>
                      <div className={styles.success_badge}>
                        <i className="ph ph-check-circle"></i> Location Captured
                      </div>
                      <div className={styles.coords_values}>
                        <span>
                          <strong>Latitude:</strong> {latitude.toFixed(5)}
                        </span>
                        <span>
                          <strong>Longitude:</strong> {longitude.toFixed(5)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.btn_location_refresh}
                      onClick={getCurrentLocation}
                    >
                      <i className="ph ph-arrows-clockwise"></i> Refresh Location
                    </button>
                  </div>
                ) : (
                  <div className={styles.coordinates_action_box}>
                    <button
                      type="button"
                      className={styles.btn_location_action}
                      onClick={getCurrentLocation}
                    >
                      <i className="ph ph-navigation-arrow"></i> Get Current Location
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.form_group}>
                <label htmlFor="landmark" className={styles.label}>
                  Landmark <span className={styles.required_marker}>*</span>
                </label>
                <input
                  type="text"
                  id="landmark"
                  className={styles.input_field}
                  placeholder="Example: Near Raniganj Bus Stand"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  required
                />
                <span
                  className={`${styles.helper_text} ${
                    !isLandmarkValid ? styles.error : ""
                  }`}
                >
                  {landmark.length > 0
                    ? `${landmark.length}/100 characters`
                    : "Landmark must be between 5–100 characters."}
                </span>
              </div>
            )}
          </div>

          <div className={styles.form_group}>
            <label className={styles.label}>
              Complaint Images
              <span className={styles.optional_text}>(Optional)</span>
            </label>

            <div
              className={styles.upload_area}
              onClick={() => fileInputRef.current.click()}
            >
              <div className={styles.upload_icon}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
              // disabled={loading}
              />
            </div>

            {images.length > 0 && (
              <div className={styles.image_previews}>
                {images.map((img, idx) => (
                  <div key={idx} className={styles.image_preview_box}>
                    <img
                      src={img.preview}
                      alt={`Preview ${idx}`}
                      className={styles.preview_img}
                    />
                    <button
                      type="button"
                      className={styles.remove_image_btn}
                      onClick={() => removeImage(idx)}
                      // disabled={loading}
                      title="Remove image"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className={styles.card_divider} />

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btn_cancel}
              onClick={handleCancel}
            // disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btn_primary}
              disabled={!isFormValid}
            >
              Submit Complaints
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
