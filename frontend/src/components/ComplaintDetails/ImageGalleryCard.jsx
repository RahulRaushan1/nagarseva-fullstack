import React from 'react'
import styles from './complaintDetails.module.css';

const ImageGalleryCard = ({ images }) => (
  <div className={styles.card}>
    <div className={styles.card_header}>
      <h3 className={styles.card_title}>Reported Issue Images</h3>
    </div>
    <div className={styles.card_body}>
      {images && images.length > 0 ? (
        <div className={styles.image_grid}>
          {images.map((img, idx) => {
            if (img.imageType === "BEFORE") {
              return (
              <div key={idx} className={styles.image_container}>
              <img src={img.url} alt={`Attachment ${idx + 1}`} className={styles.attached_img} />
            </div>
              );
            }
            
          })}
        </div>
      ) : (
        <div className={styles.empty_state}>
          <p>No images attached.</p>
        </div>
      )}
    </div>
  </div>
);

export default ImageGalleryCard
