import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./signup.module.css";
import Loader from "../../components/Loader/Loader";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [wardId, setWardId] = useState("");
  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailConsent, setEmailConsent] = useState(true);


  const validateUserCredentials = () => {
    let error = {};

    const nameRegex = /^[A-Za-z ]+$/;

    if (fullName.trim() === "" || !nameRegex.test(fullName))
      error.name = "Name Must contains only Alphabets";
    if (password.length < 8 || password.length > 15)
      error.password = "Password must be between 8-15 Characters";

    const numberRegex = /^[0-9]+$/;

    if (wardId.trim() === "" || !numberRegex.test(wardId))
      error.wardId = "WardId Must be Number";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) 
        error.email = "email must have valid format";

    if (password !== confirmPassword)
      error.confirmPassword = "Passwords do not match";

    setErrors(error);

    return Object.keys(error).length === 0;
  };

  const passwordValid = password.length >= 8 && password.length <= 15;
  const passwordMatches = password === confirmPassword;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateUserCredentials()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fullName,
            email,
            password,
            wardId,
            emailConsent
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        Object.values(errorData.errors).forEach((err) => toast.error(err));
        setErrors(errorData.errors);

        setRegistrationSuccess(false);

        return;
      }

      const data = await response.json();

      setRegistrationSuccess(true);
      toast.success(data.message);

      navigate("/login");
    } catch (err) {
      setErrors({
        apiError: "Unable to connect to server.",
      });
      toast.error("Unable to connect to server.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={styles.auth_page_body}>
      {loading && <Loader text="Creating Account..." />}
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
            <h2 className={styles.heading}>Create an account</h2>
            <p className={styles.subtext}>
              Join NagarSeva to report and track civic issues
            </p>
          </div>

          <form className={styles.auth_form} onSubmit={handleSignup}>
            <div className={styles.form_group}>
              <label htmlFor="fullname" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                className={styles.input_field}
                placeholder="John Doe"
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                className={styles.input_field}
                placeholder="name@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.input_wrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={styles.input_field}
                  placeholder="••••••••"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className={styles.toggle_icon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_svg} style={{width: '20px', height: '20px'}}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_svg} style={{width: '20px', height: '20px'}}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              <div className={`${styles.password_validation} ${passwordValid ? styles.valid : styles.invalid}`}>
                {passwordValid ? (
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
                Confirm Password
              </label>
              <div className={styles.input_wrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm_password"
                  className={styles.input_field}
                  placeholder="••••••••"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" className={styles.toggle_icon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_svg} style={{width: '20px', height: '20px'}}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon_svg} style={{width: '20px', height: '20px'}}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
                {confirmPassword.length > 0 && (
                  <span className={styles.validation_icon}>
                    {passwordMatches ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={styles.icon_svg}
                      >
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={styles.icon_svg}
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.form_group}>
              <label htmlFor="wardId" className={styles.label}>
                Ward Id
              </label>
              <input
                type="number"
                id="wardId"
                className={styles.input_field}
                placeholder="1"
                onChange={(e) => setWardId(e.target.value)}
                min={1}
                required
              />
            </div>

            <div className={styles.form_check}>
              <input
                type="checkbox"
                id="emailConsent"
                className={styles.checkbox_input}
                checked={emailConsent}
                onChange={(e) => setEmailConsent(e.target.checked)}
              />
              <label htmlFor="emailConsent" className={styles.checkbox_label}>
                Receive email notifications regarding complaint updates and civic alerts
              </label>
            </div>

            <button 
            type="submit" 
            className={styles.btn_primary}
            disabled={loading || !fullName.trim() || !email.trim() || !wardId || !passwordValid || !passwordMatches}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className={styles.auth_footer}>
            <p className={styles.footer_text}>
              Already have an account?{" "}
              <Link to="/login" className={styles.footer_link}>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
