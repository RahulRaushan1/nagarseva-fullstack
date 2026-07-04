import React from "react";
import styles from "./avatarInitials.module.css";

const AvatarInitials = ({ name, size = 40, className = "" }) => {
  const getInitials = (fullName) => {
    if (!fullName) return "NS";
    const trimmed = fullName.trim();
    if (!trimmed) return "NS";
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase() || "NS";
    }
    const first = parts[0][0] || "";
    const last = parts[parts.length - 1][0] || "";
    const initials = (first + last).toUpperCase();
    return initials || "NS";
  };

  const initials = getInitials(name);
  const fontSize = size * 0.4; // Responsive font sizing based on circular dimensions

  return (
    <div
      className={`${styles.avatar_container} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${fontSize}px`,
      }}
      title={name || "User Profile"}
    >
      {initials}
    </div>
  );
};

export default AvatarInitials;
