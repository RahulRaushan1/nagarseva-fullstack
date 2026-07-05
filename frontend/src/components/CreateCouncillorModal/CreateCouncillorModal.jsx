import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './createCouncillorModal.module.css';
import { toast } from 'react-toastify';

const CreateCouncillorModal = ({ isOpen, onClose, invokeRefreshCouncillor }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('COUNCILLOR');
  const [loading, setLoading] = useState(false);
  
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
    if (!fullName || !email || !password || !role) return;

    const loadingId = setTimeout(() => setLoading(true), 300)

    try {
      const response = await fetch("http://https://nagarseva-backend-oy56.onrender.com/admin/user", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role
        })
      })

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (errorData.code === "EMAIL_ALREADY_EXISTS") 
          toast.error("Email already registered! Please try another");
        
        return;
      }

      const data = await response.json();
      toast.success(data.message)

      invokeRefreshCouncillor();
      onClose();

    } catch (err) {
      console.log(err)
      toast.error("something went wrong.")
    } finally {
      setLoading(false)
      clearTimeout(loadingId)
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
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

          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Create Councillor</h2>
          <p className={styles.subtitle}>Add a new ward councillor to NagarSeva.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="fullName" className={styles.label}>Full Name</label>
            <input
              type="text"
              id="fullName"
              className={styles.input_field}
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}

              required
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              className={styles.input_field}
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

              required
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              className={styles.input_field}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

              required
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="role" className={styles.label}>Role</label>
            <select
              id="role"
              className={styles.input_field}
              value={role}
              onChange={(e) => setRole(e.target.value)}

              required
            >
              <option value="COUNCILLOR">Councillor</option>
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
              disabled={!fullName.trim() || !email.trim() || !password}
            >
              Create Councillor
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateCouncillorModal;
