import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../CreateWardModal/createWardModal.module.css";
import { toast } from "react-toastify";

const UpdateWardModal = ({
  isOpen,
  onClose,
  selectedWard,
  setLoading,
  setLoaderText,
  invokeRefreshWard,
  refreshWard
}) => {

  const [wardName, setWardName] = useState("");

  useEffect(() => {
    if (selectedWard) {
      setWardName(selectedWard.wardName || "");
    }
  }, [selectedWard]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!wardName.trim()) return;

    setLoaderText("Updating ward...")
    const loaderId = setTimeout(()=> setLoading(true),300);

    try {
      const response = await fetch(
        `http://https://nagarseva-backend-oy56.onrender.com/admin/ward/${selectedWard.wardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            wardName,
          }),
        }
      );

      if (!response.ok) {

        if (response.status === 401) {
          localStorage.removeItem("token");
          return;
        }


        return;
      }

      const data = await response.json();

      toast.success(data.message);
      refreshWard();

      onClose();

    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
        clearTimeout(loaderId)
        setLoading(false)
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
    >

      <div className={styles.modal}>

        <button
          className={styles.close_button}
          onClick={onClose}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>
            Update Ward
          </h2>

          <p className={styles.subtitle}>
            Modify ward information for NagarSeva.
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          <div className={styles.form_group}>

            <label className={styles.label}>
              Selected Ward
            </label>

            <div
              className={`${styles.input_field} ${styles.selected_ward_card}`}
            >

              <span className={styles.ward_badge}>
                Ward #{selectedWard?.wardId}
              </span>

              <span className={styles.ward_title}>
                {selectedWard?.wardName}
              </span>

            </div>

          </div>

          <div className={styles.form_group}>

            <label className={styles.label}>
              Ward Name
            </label>

            <input
              type="text"
              className={styles.input_field}
              placeholder="Enter ward name"
              value={wardName}
              onChange={(e) =>
                setWardName(e.target.value)
              }
            />

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
              disabled={!wardName.trim()}
            >
              Update Ward
            </button>

          </div>

        </form>

      </div>

    </div>,
    document.body
  );
};

export default UpdateWardModal;