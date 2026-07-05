import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./createOfficerModal.module.css";
import { toast } from "react-toastify";

const CreateOfficerModal = ({ isOpen, onClose, refreshOfficer, setLoading, setLoaderText}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("OFFICER");
  const [department, setDepartment] = useState("")
  
  const departments = [
  "SANITATION",
  "WATER",
  "ELECTRICITY",
  "ROADS",
  "DRAINAGE",
  "OTHER"
  ]

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = (e) => {
    if (isClosing && e.target.classList.contains(styles.overlay)) {
      setShouldRender(false);
      setIsClosing(false);
    }
  };

  if (!shouldRender) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !role || !department) return;

    setLoaderText("Creating officer...")

    const loaderId = setTimeout(() => setLoading(true),300);
    try {
      const response = await fetch("http://https://nagarseva-backend-oy56.onrender.com/admin/user", {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${localStorage.getItem("token")}`
        },
        body : JSON.stringify({
          email,
          password,
          fullName,
          role,
          department
        })
      })

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.code === "EMAIL_ALREADY_EXISTS") {
          toast.error(errorData.errors.email);
          return;
        }
      }

      const data = await response.json();

      if (data.success) 
        toast.success(data.message)

      refreshOfficer();

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("OFFICER");
      setDepartment("");
      setShowPassword(false);
      onClose();
    } catch (error) {
      console.log("error side")
      console.log(error)
    } finally {
      clearTimeout(loaderId)
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className={`${styles.overlay} ${isClosing ? styles.fadeOut : ""}`} 
      onClick={handleBackdropClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.modal}>
        <button
          className={styles.close_button}
          onClick={onClose}
          // 
          aria-label="Close modal"
        >
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Create New Officer</h2>
          <p className={styles.subtitle}>
            Add a new municipal officer to NagarSeva.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className={styles.input_field}
              placeholder="Enter officer name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              // 
              required
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.input_field}
              placeholder="Enter officer email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
              required
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
                className={`${styles.input_field} ${styles.password_input}`}
                placeholder="Enter temporary password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                
                required
              />
              <button
                type="button"
                className={styles.toggle_icon}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.icon_svg}
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.icon_svg}
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="role" className={styles.label}>
              Role
            </label>
            <select
              id="role"
              className={styles.input_field}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              
              required
            >
              <option value="OFFICER">OFFICER</option>
            </select>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="department" className={styles.label}>
              Department
            </label>
            <select
              id="department"
              className={styles.input_field}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              
              required
            >
              <option value="" disabled>
                Select Department
              </option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.button_group}>
            <button
              type="button"
              className={styles.btn_cancel}
              onClick={onClose}
              
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btn_primary}
              disabled={
                // loading ||
                !fullName.trim() ||
                !email.trim() ||
                !password ||
                !department
              }
            >
              Create Officer
            
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateOfficerModal;
