import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./CouncillorProfile.module.css";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import AvatarInitials from "../../../components/AvatarInitials/AvatarInitials";

const CouncillorProfile = ({ setLoading, setLoaderText }) => {
  const [profile, setProfile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPasswordText, setShowOldPasswordText] = useState(false);
  const [showNewPasswordText, setShowNewPasswordText] = useState(false);
  const [showConfirmPasswordText, setShowConfirmPasswordText] = useState(false);


  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoaderText("Fetching profile details...");
    const loaderId = setTimeout(() => setLoading(true),300)
    try {
      const response = await fetch("https://nagarseva-backend-oy56.onrender.com/councillor/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
          toast.warning("Session expired, please login again");
          return;
        }
        toast.error("Failed to fetch profile details");
        return;
      }

      const data = await response.json();
      if (data.success || data.email) {
        setProfile(data);
      } else {
        toast.error(data.message || "Failed to fetch profile");
      }
    } catch (err) {
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
      clearInterval(loaderId)
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8 || newPassword.length > 15) {
      toast.error("Password must be between 8 and 15 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoaderText("Updating password...");
    setLoading(true);

    try {
      const response = await fetch("https://nagarseva-backend-oy56.onrender.com/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.message || "Failed to update password");
        return;
      }

      toast.success("Password updated successfully");
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = newPassword.length >= 8 && newPassword.length <= 15;
  const isConfirmValid = newPassword === confirmPassword && confirmPassword.length > 0;

  if (!profile) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "#6b7280" }}>
        <span>Loading Profile...</span>
      </div>
    );
  }

  return (
    <div className={styles.profile_wrapper}>
      {/* 1. Profile Hero Card */}
      <div className={`${styles.profile_card} ${styles.hero_card}`}>
        <div className={styles.hero_inner}>
          <div className={styles.hero_left}>
            <AvatarInitials name={profile.fullName} size={96} className={styles.avatar_circle} />
          </div>
          <div className={styles.hero_right}>
            <div className={styles.hero_header}>
              <h2 className={styles.name}>{profile.fullName}</h2>
              <span className={styles.role_badge}>Ward Councillor</span>
              <span className={styles.status_badge}>Active</span>
            </div>
            <div className={styles.email}>
              <i className="ph ph-envelope"></i> {profile.email}
            </div>
            <div className={styles.meta_info}>
              <div className={styles.meta_item}>
                <i className="ph ph-map-pin"></i>
                <span className={styles.meta_label}>Ward ID:</span>
                <strong>{profile.wardId || "N/A"}</strong>
              </div>
              <div className={styles.meta_item}>
                <i className="ph ph-buildings"></i>
                <span className={styles.meta_label}>Ward Name:</span>
                <strong>{profile.wardName || "Not Assigned"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tagline_section}>
          <p className={styles.tagline}>
            Your Voice &bull; Your City &bull; Your Change
          </p>
          <span className={styles.admin_helper}>
            <i className="ph ph-info"></i> Councillor account details are managed by NagarSeva Administration.
          </span>
        </div>
      </div>

      {/* 2. Security Settings Card */}
      <div className={styles.profile_card}>
        <h3 className={styles.card_title}>
          <i className="ph ph-shield-check"></i> Security Settings
        </h3>
        <div className={styles.security_body}>
          <div>
            <p className={styles.card_description} style={{ margin: 0 }}>
              Keep your account secure by updating your password regularly.
            </p>
          </div>
          <button
            className={styles.btn_primary}
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div>
      </div>


      {/* Change Password Modal */}
      {showPasswordModal && createPortal(
        <div className={styles.modal_overlay}>
          <div className={styles.modal_content}>
            <div className={styles.modal_header}>
              <h3 className={styles.modal_title}>Change Password</h3>
              <button
                className={styles.btn_close}
                onClick={() => setShowPasswordModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handlePasswordChangeSubmit}>
              <div className={styles.form_group}>
                <label className={styles.label}>Current Password</label>
                <div className={styles.input_wrapper}>
                  <input
                    type={showOldPasswordText ? "text" : "password"}
                    className={styles.input_field}
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.toggle_icon}
                    onClick={() => setShowOldPasswordText(!showOldPasswordText)}
                  >
                    <i className={showOldPasswordText ? "ph ph-eye-slash" : "ph ph-eye"}></i>
                  </button>
                </div>
              </div>

              <div className={styles.form_group}>
                <label className={styles.label}>New Password</label>
                <div className={styles.input_wrapper}>
                  <input
                    type={showNewPasswordText ? "text" : "password"}
                    className={styles.input_field}
                    placeholder="Enter new password (8-15 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.toggle_icon}
                    onClick={() => setShowNewPasswordText(!showNewPasswordText)}
                  >
                    <i className={showNewPasswordText ? "ph ph-eye-slash" : "ph ph-eye"}></i>
                  </button>
                </div>
                {newPassword.length > 0 && (
                  <div className={`${styles.password_validation} ${isPasswordValid ? styles.valid : styles.invalid}`}>
                    <i className={isPasswordValid ? "ph ph-check-circle" : "ph ph-warning-circle"}></i>
                    <span>8-15 characters required</span>
                  </div>
                )}
              </div>

              <div className={styles.form_group}>
                <label className={styles.label}>Confirm New Password</label>
                <div className={styles.input_wrapper}>
                  <input
                    type={showConfirmPasswordText ? "text" : "password"}
                    className={styles.input_field}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.toggle_icon}
                    onClick={() => setShowConfirmPasswordText(!showConfirmPasswordText)}
                  >
                    <i className={showConfirmPasswordText ? "ph ph-eye-slash" : "ph ph-eye"}></i>
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <div className={`${styles.password_validation} ${isConfirmValid ? styles.valid : styles.invalid}`}>
                    <i className={isConfirmValid ? "ph ph-check-circle" : "ph ph-warning-circle"}></i>
                    <span>{isConfirmValid ? "Passwords match" : "Passwords do not match"}</span>
                  </div>
                )}
              </div>

              <div className={styles.modal_footer}>
                <button
                  type="button"
                  className={styles.btn_cancel}
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btn_primary}
                  disabled={!isPasswordValid || !isConfirmValid || !oldPassword}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <ConfirmationModal
          title="Logout Confirmation"
          message="Are you sure you want to logout from NagarSeva?"
          confirmText="Logout"
          cancelText="Stay Logged In"
          danger={true}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};

export default CouncillorProfile;
