// src/components/Widgets/Card.js
import React from 'react';
import styles from './Card.module.css';

const Card = ({ item, cardConfig }) => {
  const {
    titleKey = 'title',
    imageKey = 'imageUrl',
    descriptionKey = 'description',
    priceKey = 'price'
  } = cardConfig || {};

  const title = item[titleKey];
  const imageUrl = item[imageKey];
  const description = item[descriptionKey];
  const price = item[priceKey];

  return (
    <div className={styles.card}>
      {imageUrl && <img src={imageUrl} alt={title || 'Card image'} className={styles.cardImage} />}
      <div className={styles.cardBody}>
        {title && <h5 className={styles.cardTitle}>{title}</h5>}
        {description && <p className={styles.cardDescription}>{description}</p>}
        {price && <p className={styles.cardPrice}>{typeof price === 'number' ? `$${price.toFixed(2)}` : price}</p>}
        
      </div>
    </div>
  );
};

export default Card;