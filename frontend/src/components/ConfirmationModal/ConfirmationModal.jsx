import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './confirmationModal.module.css';

const ConfirmationModal = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  danger = false
}) => {


  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={`${styles.icon_container} ${danger ? styles.icon_danger : styles.icon_primary}`}>
            {danger ? (
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
          </div>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.footer}>
          <button 
            className={styles.btn_cancel} 
            onClick={onClose}
            // disabled={loading}
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.btn_confirm} ${danger ? styles.btn_danger : styles.btn_primary}`}
            onClick={onConfirm}
            // disabled={loading}
          >
            <div >{confirmText}</div>
          
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
