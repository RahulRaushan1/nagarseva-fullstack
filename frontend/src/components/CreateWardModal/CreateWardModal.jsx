import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './createWardModal.module.css';
import { toast } from "react-toastify";

const CreateWardModal = ({ isOpen, onClose, refreshWard, refreshWardDetails}) => {
  const [wardId, setWardId] = useState('');
  const [wardName, setWardName] = useState('');
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
    if (!wardId || !wardName) return;

    setLoading(true);
    try {

      const response = await fetch("http://https://nagarseva-backend-oy56.onrender.com/admin/ward", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body : JSON.stringify({
            wardId,
            wardName
          })
        });

        if (!response.ok) {
          const errorData = await response.json();

          if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (response.status === 409) {
          toast.error("Ward already exists");
        }
          return;
        }

        const data = await response.json();

        toast.success(data.message)

        
        // Reset form after successful submission
        setWardId('');
        setWardName('');
        
        refreshWard();
        refreshWardDetails();
        onClose();
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
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
          disabled={loading}
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Create New Ward</h2>
          <p className={styles.subtitle}>Add a new municipal ward to NagarSeva.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="wardId" className={styles.label}>Ward ID</label>
            <input
              type="number"
              id="wardId"
              className={styles.input_field}
              placeholder="Enter ward id"
              value={wardId}
              onChange={(e) => setWardId(e.target.value)}
              disabled={loading}
              required
              min="1"
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="wardName" className={styles.label}>Ward Name</label>
            <input
              type="text"
              id="wardName"
              className={styles.input_field}
              placeholder="Enter ward name"
              value={wardName}
              onChange={(e) => setWardName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.button_group}>
            <button 
              type="button" 
              className={styles.btn_cancel} 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.btn_primary}
              disabled={loading || !wardId || !wardName.trim()}
            >
              {loading ? (
                <>
                  <svg className={styles.spinner_icon} viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  Creating...
                </>
              ) : "Create Ward"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateWardModal;
