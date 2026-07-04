import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logoSection} onClick={(e) => scrollToSection(e, "home")} style={{ cursor: "pointer" }}>
          <img
            src="https://res.cloudinary.com/dzexb7f3p/image/upload/v1778174553/Gemini_Generated_Image_dk0cs1dk0cs1dk0c_4_copy_ibfkmg.png"
            alt="NagarSeva Logo"
            className={styles.logo}
          />
          <span className={styles.logoText}>NagarSeva</span>
        </div>

        <ul className={styles.navLinks}>
          <li>
            <a href="#home" onClick={(e) => scrollToSection(e, "home")}>Home</a>
          </li>
          <li>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, "how-it-works")}>Track Complaint</a>
          </li>
          <li>
            <a href="#role-access" onClick={(e) => scrollToSection(e, "role-access")}>About</a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Contact</a>
          </li>
        </ul>

        <div className={styles.navActions}>
          <button className={styles.loginBtn} onClick={() => navigate("/login")}>Login</button>

          <button
            className={styles.menuBtn}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ""}`}>
        <a href="#home" onClick={(e) => scrollToSection(e, "home")}>Home</a>
        <a href="#how-it-works" onClick={(e) => scrollToSection(e, "how-it-works")}>Track Complaint</a>
        <a href="#role-access" onClick={(e) => scrollToSection(e, "role-access")}>About</a>
        <a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
