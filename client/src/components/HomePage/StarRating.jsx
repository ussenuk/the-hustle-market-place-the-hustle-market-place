import React, { useState, useEffect } from "react";

const StarRating = ({ serviceId, onRatingChange }) => {
  const storedRating = Number(localStorage.getItem(serviceId)) || 0;
  const [rating, setRating] = useState(storedRating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setRating(storedRating);
    console.log(`Service ID: ${serviceId}, Rating: ${rating}`);
    // Notify parent component about the rating change
    onRatingChange(rating);
  }, [storedRating]);

  const handleMouseOver = (starRating) => {
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (starRating) => {
    setRating(starRating);
    localStorage.setItem(serviceId, starRating); // Store the rating in local storage
    // Notify parent component about the rating change
    onRatingChange(starRating);
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        onMouseOver={() => handleMouseOver(i)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(i)}
        style={{
          color: (i <= hoverRating || i <= rating) ? 'gold' : 'gray',
          cursor: 'pointer'
        }}
      >
        ★
      </span>
    );
  }
  return <div>{stars}</div>;
};

export default StarRating;
