import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./updatePassword.module.css";
import Loader from "../../components/Loader/Loader";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation rules
  const isPasswordValid = password.length >= 8 && password.length <= 15;
  const isConfirmValid = password === confirmPassword && confirmPassword.length > 0;

   const redirectToDashboard = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        navigate("/admin/dashboard");
        break;

      case "ROLE_COUNCILLOR":
        navigate("/councillor/dashboard");
        break;

      case "ROLE_OFFICER":
        navigate("/officer/dashboard");
        break;

      default:
        return;
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Please ensure your password meets all requirements.");
      return;
    }

    if (!isConfirmValid) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Typically you would send the token in headers to identify the user
      const response = await fetch("https://nagarseva-backend-oy56.onrender.com/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
           },
        body: JSON.stringify({
          newPassword: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        console.log(errorData)
        return;
      }

      toast.success("Password updated successfully");
      
      const role = localStorage.getItem("role");
      redirectToDashboard(role)
      
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.auth_page_body}>
      {loading && <Loader text="Updating Password..." />}
      <div className={styles.auth_container}>
        <div className={styles.auth_card}>
          <div className={styles.auth_header}>
            <div className={styles.logo}>
              <img
                src="https://res.cloudinary.com/dzexb7f3p/image/upload/v1778174553/Gemini_Generated_Image_dk0cs1dk0cs1dk0c_4_copy_ibfkmg.png"
                alt="NagarSeva Logo"
                className={styles.logo_img}
              />
            </div>
            <h2 className={styles.heading}>Update Your Password</h2>
            <p className={styles.subtext}>
              For security reasons, you must update your password before continuing.
            </p>
          </div>

          <form className={styles.auth_form} onSubmit={handleUpdatePassword}>
            <div className={styles.form_group}>
              <label htmlFor="password" className={styles.label}>
                New Password
              </label>
              <div className={styles.input_wrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={styles.input_field}
                  placeholder="••••••••"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <button
                  type="button"
                  className={styles.toggle_icon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_svg}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_svg}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              
              <div className={`${styles.password_validation} ${isPasswordValid ? styles.valid : styles.invalid}`}>
                {isPasswordValid ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_small}>
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_small}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    <path d="M12 8v4"></path>
                  </svg>
                )}
                <span>8-15 characters required</span>
              </div>
            </div>

            <div className={styles.form_group}>
              <label htmlFor="confirm_password" className={styles.label}>
                Confirm New Password
              </label>
              <div className={styles.input_wrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm_password"
                  className={styles.input_field}
                  placeholder="••••••••"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
                <button
                  type="button"
                  className={styles.toggle_icon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_svg}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_svg}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
                {/* Visual match indicator */}
                {confirmPassword.length > 0 && (
                  <span className={styles.validation_icon}>
                    {isConfirmValid ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_svg}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_svg}>
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    )}
                  </span>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.btn_primary}
              disabled={loading || !isPasswordValid || !isConfirmValid}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
