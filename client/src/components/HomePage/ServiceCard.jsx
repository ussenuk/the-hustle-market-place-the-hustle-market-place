import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles"; // Import makeStyles
import StarRating from "./StarRating";

const useStyles = makeStyles(() => ({
  card: {
    width: 500,
    // backgroundColor: "#242424",
    color: "#242424",
    padding:"2rem",
    marginBottom: "1rem", // Adjust spacing as needed
    marginLeft:"1rem",
    
    "& img": {
      width: "100%",
      height: "auto"
    },
    "& textarea": {
      width: "100%",
      marginBottom: "0.5rem", // Adjust spacing as needed
      padding: "0.5rem",
      color: "#242424",
      border: "1px solid",
      borderColor:"#242424",
      borderRadius: "8px",
      resize: "none",
      fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
      fontSize: "1rem",
      lineHeight: "1.5",
      fontWeight: "400"
    }
  },
  button: {
    borderRadius: "8px",
    border: "1px solid transparent",
    padding: "0.6em 1.2em",
    fontSize: "1rem",
    fontWeight: "500",
    fontFamily: "inherit",
    backgroundColor: "#1a1a1a",
    cursor: "pointer",
    transition: "border-color 0.25s",
    "&:hover": {
      borderColor: "#4CAF50",
      color: "#ffffff",
      backgroundColor: "#4CAF50"
    },
    "&:focus, &:focus-visible": {
      outline: "4px auto -webkit-focus-ring-color"
    }
  },
  customButton: {
    borderRadius: "8px",
    border: "1px solid transparent",
    padding: "0.6em 1.2em",
    fontSize: "1rem",
    fontWeight: "500",
    fontFamily: "inherit",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    cursor: "pointer",
    transition: "border-color 0.25s",
    "&:hover": {
      borderColor: "#4CAF50",
      color: "#ffffff",
      backgroundColor: "#4CAF50"
    },
    "&:focus, &:focus-visible": {
      outline: "4px auto -webkit-focus-ring-color"
    }
  },
  label: {
    color: "#3f51b5", 
    fontWeight: "bold",
    fontSize:"1rem" 
  },
  notify: {
    color: "#4CAF50", 
    fontWeight: "bold",
    fontSize:"1rem" 
  },
  important: {
    color: "#FFD700", 
    fontWeight: "bold",
    fontSize:"1rem" 
  },
}));

const CustomButton = ({ onClick, children, disabled }) => {
    const classes = useStyles();
    return (
      <button
        onClick={onClick}
        className={classes.customButton}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

const ServiceCard = ({
  service,
  handleReview,
  handleBooking,
  bookedServiceId,
  setBookedServiceId,
  bookingDateTime,
  setBookingDateTime,
  reviewComment,
  setReviewComment,
  rating, 
  setRating 
}) => {
  const classes = useStyles();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  

  const handleBookService = async () => {
    await handleBooking(service.service_id);
    setShowSuccessMessage(true);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating); // Update the rating state when it changes
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <img src={`http://localhost:5555${service.work_images_url}`} alt="" />
        <h3 >
          {service.service_title}
        </h3>
        <Typography  align="justify">
          <span  className={classes.label}>Category:</span> {service.service_category}
        </Typography>
        <Typography align="justify">
          <span className={classes.label}>Posted by:</span> {service.service_provider}
        </Typography>
        <Typography align="justify">
          <span className={classes.label}>Location:</span> {service.location}
        </Typography>
        <Typography align="justify">
          <span className={classes.label}>Description:</span> {service.service_provider_bio}
        </Typography>
        <Typography align="justify">
          <span className={classes.label}>Available Hours:</span> {service.hours_available}
        </Typography>
        <Typography align="justify">
        <span className={classes.label}>Pricing:</span> {service.pricing}</Typography>
        <input
          type="datetime-local"
          value={bookingDateTime}
          onChange={(e) => setBookingDateTime(e.target.value)}
        />
        <StarRating serviceId={service.service_id} onRatingChange={handleRatingChange} initialRating={rating}/>
        <textarea
          rows="3"
          placeholder="Leave a review"
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
        ></textarea>
      </CardContent>
      <CardActions>
        <CustomButton
          onClick={handleBookService}
          
          disabled={showSuccessMessage}
           
        >
          Book Now
        </CustomButton>
        {showSuccessMessage && (
          <div className="booking-success-popup">
            <span className={classes.notify}>You have successfully booked the service.</span>
            <CustomButton ><span className={classes.important}>Pay</span></CustomButton> 
          </div>
        )}
        <CustomButton
          onClick={() => handleReview(service.service_id)}
           
        >
          Review
        </CustomButton>
        <CustomButton
           
        >
          Message
        </CustomButton>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;
