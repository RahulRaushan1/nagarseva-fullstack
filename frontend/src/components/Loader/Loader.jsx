import React from 'react';
import styles from './loader.module.css';

const Loader = ({ text }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader_wrapper}>
        <div className={styles.loader_container}>
          <div className={styles.spinner}></div>
          <img 
            src="https://res.cloudinary.com/dzexb7f3p/image/upload/v1778174553/Gemini_Generated_Image_dk0cs1dk0cs1dk0c_4_copy_ibfkmg.png" 
            alt="Loading..." 
            className={styles.logo}
          />
        </div>
        {text && <div className={styles.loading_text}>{text}</div>}
      </div>
    </div>
  );
};

export default Loader;
