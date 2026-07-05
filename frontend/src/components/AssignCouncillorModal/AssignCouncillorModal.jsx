import React, { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./assignCouncillorModal.module.css";
import { toast } from "react-toastify";

const AssignCouncillorModal = ({
  isOpen,
  onClose,
  ward,
  councillors,
  setLoading,
   setLoaderText ,
   refreshWard, refreshCouncillor
}) => {
  
  const [selectedCouncillor, setSelectedCouncillor] = useState("");
  
  if (!isOpen) return null;
  console.log("haula")

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCouncillor) return;

    setLoaderText("Assigning councillor...")
    const loaderId = setTimeout(() => setLoading(true),300)

    try {
        const response = await fetch(`https://nagarseva-backend-oy56.onrender.com/admin/ward/${ward.wardId}/assign-wc?councillorId=${selectedCouncillor}`,{
            method : "PUT",
            headers : {
                "Content-Type" : "Application/json",
                Authorization : `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                id : ward.wardId,
                councillorId : selectedCouncillor
            })
        })


        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.code === "COUNCILLOR_ALREADY_EXISTS") {
                toast.error("Councillor is already registered with another ward");
                return;
            }
        }

        const data = await response.json();

        toast.success("councillor assigned successfully");
        refreshWard();
        refreshCouncillor();
        onClose();

    } catch (err) {
      console.log(err);
      toast.error("something went wrong")
    } finally {
      setLoading(false)
      clearTimeout(loaderId)
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleBackdropClick}>
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
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Assign Councillor</h2>

          <p className={styles.subtitle}>
            Assign a councillor to this ward.
          </p>
        </div>

        <div className={styles.ward_info}>
          <span className={styles.ward_badge}>
            Ward #{ward?.wardId}
          </span>

          <h3 className={styles.ward_name}>
            {ward?.wardName}
          </h3>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.form_group}>
            <label className={styles.label}>
              Select Councillor
            </label>

            <select
              className={styles.input_field}
              value={selectedCouncillor}
              onChange={(e) =>
                setSelectedCouncillor(e.target.value)
              }
            >
              <option value="">
                Select councillor
              </option>

              {councillors.map((councillor) => (
                <option
                  key={councillor.councillorId}
                  value={councillor.councillorId}
                >
                  {councillor.name} (ID: {councillor.councillorId})
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
              disabled={!selectedCouncillor}
            > Assign Councillor
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};

export default AssignCouncillorModal;