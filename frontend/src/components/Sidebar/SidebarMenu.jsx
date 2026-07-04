import React from 'react'
import { useState } from "react";
import styles from './SidebarStyle.module.css'

const SidebarMenu = (props) => {

  return (
    <>
    <div className={styles.logo}>
            <img src="https://res.cloudinary.com/dzexb7f3p/image/upload/v1778174553/Gemini_Generated_Image_dk0cs1dk0cs1dk0c_4_copy_ibfkmg.png" alt="Logo" width="40" height="40" className={styles.logo_img} />
        </div>

        <nav className={styles.menu}>
           
            {props.sidebarItems.map((item,idx) => (
                <a key={idx} href="#" 
                   className={item.title === props.activeSection ? `${styles.menu_item} ${styles.active}` : `${styles.menu_item}`}
                   onClick={(e) => {
                       e.preventDefault(); // prevent anchor default jumping
                       props.setActiveSection(item.title);
                   }}>
                <div className={styles.item_left}>
                    <i className={`${item.icon} ${styles.icon}`}></i>
                    <span>{item.title}</span>
                </div>
                </a>
            ))}
        </nav>
        
        </>
  )
}

export default SidebarMenu
