import React from 'react'
import styles from './SidebarStyle.module.css'
import { toast } from 'react-toastify'

const SidebarBottom = () => {
  const handleThemeToggle = () => {
    toast.info("Dark mode will be added soon.");
  };

  return (
    <div className={styles.sidebar_bottom}>
            {/* <button className={styles.sidebar_icon_btn}>
                <i className="ph ph-chat-circle"></i>
            </button> */}
            
            <div className={styles.theme_toggle}>
                <button className={`${styles.theme_btn} ${styles.active}`} onClick={handleThemeToggle}>
                    <i className="ph-fill ph-moon"></i>
                </button>
                <button className={styles.theme_btn} onClick={handleThemeToggle}>
                    <i className="ph ph-sun"></i>
                </button>
            </div>
        </div>
  )
}

export default SidebarBottom
