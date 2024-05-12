import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles"; // Import makeStyles
import StarRating from "./StarRating";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  card: {
    width: 500,
    backgroundColor: "#f7fee7",
    // backgroundColor: "#f9f9f9",
    color: "#242424",
    padding:"2rem",
    marginBottom: "1rem", // Adjust spacing as needed
    marginLeft:"1rem",
    borderColor:"#242424",
    borderRadius: "8px",

    
    "& img": {
      width: "100%",
      height: "auto"
    },
    "& textarea": {
      width: "100%",
      marginBottom: "0.2rem", // Adjust spacing as needed
      padding: "0.2rem",
      color: "#242424",
      border: "1px solid",
      borderColor:"#242424",
      borderRadius: "8px",
      resize: "none",
      fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
      fontSize: "1rem",
      lineHeight: "1",
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
    fontSize:"0.8rem" 
  },
  label2: { 
    fontSize:"0.8rem" 
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
  handlePayNow,
  bookedServiceId,
  setBookedServiceId,
  bookingDateTime,
  setBookingDateTime,
  reviewComment,
  setReviewComment,
  rating, 
  setRating,
  serviceId, 
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [averageRating, setAverageRating] = useState(null); // State to store average rating
  const [randomComment, setRandomComment] = useState(""); // State to store random comment


  useEffect(() => {
    // Fetch average rating when component mounts
    fetchAverageRating();
    fetchRandomComment();
  }, []); // Run this effect only once when component mounts

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`/get_reviews_with_average_rating`);
      console.log("API Response:", response.data);
  
      const bookingRatings = response.data;
      const serviceAverageRating = bookingRatings[serviceId]?.average_rating; // Extract average rating for the current service
      console.log("Service Average Rating:", serviceAverageRating);
      setAverageRating(serviceAverageRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const fetchRandomComment = async () => {
    try {
      const response = await axios.get(`/get_random_comment/${serviceId}`);
      console.log("Random Comment API Response:", response.data);
  
      const randomCommentData = response.data;
      setRandomComment(randomCommentData.random_comment);
    } catch (error) {
      console.error("Error fetching random comment:", error);
    }
  };

  const handleBookService = async () => {
    await handleBooking(service.service_id);
    setShowSuccessMessage(true);
  };

  const handleMessage = (receiverId) => {
    const loggedInUserId = sessionStorage.getItem('user_id');
    if (!loggedInUserId) {
      navigate('/login');
      return;
    }
    navigate(`/new_message/${receiverId}`);
    console.log("Messaging service provider for service with ID:", receiverId);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating); // Update the rating state when it changes
  };

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: (i <= averageRating) ? '#E0BE36' : 'gray',
            cursor: 'pointer'
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <img src={`http://localhost:5555${service.work_images_url}`} alt="" />
        <h3 >
          {service.service_title}
        </h3>
        <Typography  align="justify">
          <span  className={classes.label}>Category:</span> <span  className={classes.label2}>{service.service_category}</span>
        </Typography>
        <Typography align="justify">
          <span className={classes.label}>Posted by:</span> <span  className={classes.label2}>{service.service_provider}</span> 
        </Typography>
        <Typography align="justify">
          <span className={classes.label}>Location:</span> <span  className={classes.label2}>{service.location}</span>
        </Typography>
        <Typography align="justify">
          <span className={classes.label}>Description:</span> <span  className={classes.label2}>{service.service_provider_bio}</span>
        </Typography>
        <Typography align="justify">
          <span className={classes.label}>Available Hours:</span> <span  className={classes.label2}>{service.hours_available}</span>
        </Typography>
        <Typography align="justify">
        <span className={classes.label}>Pricing:</span> <span  className={classes.label2}>{service.pricing}</span></Typography>
        <Typography align="justify">
          <span className={classes.label}>Average Rating of this service:</span>{" "}
          <span className={classes.label2}>{renderStarRating()}</span>
        </Typography>
        <input
          type="datetime-local"
          value={bookingDateTime}
          onChange={(e) => setBookingDateTime(e.target.value)}
        />
        <StarRating serviceId={service.service_id} onRatingChange={handleRatingChange} initialRating={rating}/>
        
        <textarea
          rows="3"
          placeholder="Rate and Leave a review"
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
        ></textarea>
      <Typography align="justify">
        <span className={classes.label}>Random Comment:</span> <span  className={classes.label2}>{randomComment}</span>
      </Typography>
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
            
            <Button onClick={() => handlePayNow(serviceId, service.price)} variant="contained">Pay</Button> 
          </div>
        )}
        <CustomButton
          onClick={() => handleReview(serviceId)}
           
        >
          Review
        </CustomButton>
        <CustomButton
           onClick={() => handleMessage(service.service_id)}
        >
          Message
        </CustomButton>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;

