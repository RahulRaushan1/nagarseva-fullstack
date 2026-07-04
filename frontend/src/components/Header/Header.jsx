import React from 'react'
import styles from './header.module.css'
import AvatarInitials from '../AvatarInitials/AvatarInitials'

const Header = (props) => {
  const role = localStorage.getItem("role");
  const defaultName = role === "ROLE_ADMIN" 
    ? "Admin" 
    : role === "ROLE_OFFICER" 
      ? "Officer" 
      : role === "ROLE_COUNCILLOR" 
        ? "Councillor" 
        : role === "ROLE_CITIZEN" 
          ? "Citizen" 
          : "NS";

  const displayName = props.name || defaultName;

  return (
   <header className={styles.header}>
            <div className={styles.header_left}>
                <button className={styles.mobile_menu_btn} onClick={props.onMenuClick}>
                    <i className="ph ph-list"></i>
                </button>
                <div className={styles.header_text}>
                <h1 className={styles.page_title}>{props.header}</h1>
                <p className={styles.page_subtitle}>{props.subtitle}</p>
                </div>
            </div>
            
            <div className={styles.header_right}>
                <button className={styles.header_icon_btn}>
                    <i className="ph ph-bell"></i>
                </button>
                
                {/* <button className={styles.header_icon_btn}>
                    <i className="ph ph-chat-circle"></i>
                </button> */}
                
                <div className={styles.user_avatar}>
                    <AvatarInitials name={displayName} size={40} />
                </div>
            </div>
        </header>

  )
}

export default Header
