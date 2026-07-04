import React from "react";
import styles from "./complaintDetails.module.css";

const LocationDetailsCard = ({ location }) => {
  const latitude = location?.latitude;
  const longitude = location?.longtitude !== undefined ? location?.longtitude : location?.longitude;
  const landmark = location?.landmark;

  const hasCoordinates = latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined;
  const hasLandmark = landmark !== null && landmark !== undefined && landmark.trim() !== "";

  const hasLocation = hasCoordinates || hasLandmark;

  const handleViewOnMap = () => {
    if (hasCoordinates) {
      window.open(`https://maps.google.com/?q=${latitude},${longitude}`, "_blank");
    }
  };

  const formatCoord = (val) => {
    if (val === null || val === undefined) return "N/A";
    const num = Number(val);
    return isNaN(num) ? val : num.toFixed(5);
  };

  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <h3 className={styles.card_title}>📍 Location Details</h3>
      </div>
      <div className={styles.card_body}>
        {hasLocation ? (
          <div className={styles.info_grid}>
            {hasCoordinates && (
              <div className={styles.info_item}>
                <span className={styles.info_label}>Coordinates</span>
                <span className={styles.info_value} style={{ fontSize: "14px", marginTop: "4px", lineHeight: "1.6" }}>
                  Latitude: {formatCoord(latitude)}
                  <br />
                  Longitude: {formatCoord(longitude)}
                </span>
                <button
                  type="button"
                  onClick={handleViewOnMap}
                  className={styles.btn_view_map}
                >
                  <i className="ph ph-map-pin"></i> View on Map 📍
                </button>
              </div>
            )}
            {hasLandmark && (
              <div className={styles.info_item}>
                <span className={styles.info_label}>Landmark</span>
                <span className={styles.info_value} style={{ marginTop: "4px" }}>
                  {landmark}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.empty_state}>
            <div className={styles.empty_icon}>
              <i className="ph ph-map-pin-slash" style={{ fontSize: "24px" }}></i>
            </div>
            <p style={{ margin: 0 }}>No location details available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetailsCard;
