import React from 'react'
import SidebarMenu from './SidebarMenu'
import SidebarBottom from './SidebarBottom'
import styles from './SidebarStyle.module.css'

const Sidebar = (props) => {

  return (
    <aside className={`${styles.sidebar} ${props.isOpen ? styles.open : ''}`}>

        <SidebarMenu sidebarItems={props.sidebarItems} activeSection={props.activeSection} setActiveSection={props.setActiveSection}/>
        <SidebarBottom />

    </aside>
  )
}

export default Sidebar
