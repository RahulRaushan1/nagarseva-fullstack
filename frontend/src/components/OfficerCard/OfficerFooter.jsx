import React, { useState, useEffect } from 'react'
import styles from './OfficerCard.module.css'
import { toast } from 'react-toastify';

const OfficerFooter = ({userId, currentStatus}) => {

  const [active, setActive] = useState(currentStatus);

  useEffect(() => {
    if (currentStatus !== undefined && currentStatus !== null) {
      setActive(currentStatus);
    }
  }, [currentStatus]);

  const handleAccount = async () => {
    const nextStatus = !active;
    try {
      const response = await fetch(`http://localhost:8080/admin/user/${userId}/status?active=${nextStatus}`,{
        method : "PUT",
        headers : {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to update status");
        return;
      }

      const data = await response.json().catch(() => ({}));
      if (data.success) {
        toast.success(data.message || "User account status updated");
        setActive(nextStatus);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Unable to connect with server")
    }
  }

  if (active === undefined || active === null) {
    return null;
  }

  return (
    <div className={styles.card_footer}>
      <div className={styles.card_actions}>
        <button 
          className={`${styles.btn} ${active ? styles.btn_active : styles.btn_disable}`} 
          onClick={handleAccount}
          title={active ? "Disable Officer" : "Enable Officer"}
        >
          <i className={active ? "ph ph-check-circle" : "ph ph-prohibit"}></i>
          {active ? "Active" : "Disabled"}
        </button>
      </div>
    </div>
  )
}

export default OfficerFooter
