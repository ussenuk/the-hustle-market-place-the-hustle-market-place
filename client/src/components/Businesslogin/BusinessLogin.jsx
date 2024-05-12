

// client/src/components/Businesslogin/BusinessLogin.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./businesslogin.css";
import userImage from "../DashBoard/ServiceProviderDashboard/pages/teacher.png"
import { useDropzone } from "react-dropzone";

const BusinessLogin = ({isLoggedIn, setIsLoggedIn}) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);


  const [serviceButtonClicked, setServiceButtonClicked] = useState(false); // Track if the service list button is clicked

  useEffect(() => {
    // Check if the service list button has been clicked previously
    const serviceButtonStatus = sessionStorage.getItem("serviceButtonClicked");
    if (serviceButtonStatus) {
      setServiceButtonClicked(true);
    }
  }, []);

  // Function to handle file uploads
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    service_title: "",
    service_category: "",
    pricing: "",
    hours_available: "",
    location: "",
    business_description: "",
    profile_picture: null,
    video: null,
    work_images: [],
    registration_document: null,
  });
  const [error, setError] = useState("");

  // Update handleInputChange function to handle file inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "profile_picture" ||
      name === "video_demo" ||
      name === "images_of_work" ||
      name === "document_proof"
    ) {
      setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error message when user starts typing
    setError("");
    
  };
  const validateForm = () => {
    const {
      fullname,
      username,
      email,
      password,
      service_title,
      pricing,
      hours_available,
      location,
      business_description,
      profile_picture,
      video,
      work_images,
      registration_document,
      service_category,
      custom_service_category,
    } = formData;

    // Check for empty fields
    if (
      !fullname ||
      !username ||
      !email ||
      !password ||
      !service_title ||
      !(service_category || custom_service_category) ||
      !pricing ||
      !hours_available ||
      !location ||
      !business_description ||
      !profile_picture ||
      !video ||
      !work_images ||
      !registration_document
    ) {
      setError("Please fill in all fields.");
      return false;
    }

    // Additional validation for business description length when registering
    if (
      isRegistering &&
      (business_description.length < 200 || business_description.length > 1000)
    ) {
      setError("Business description must be between 200 and 1000 characters.");
      return false;
    }

    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "businessregister" : "businesslogin";

    // Check if the selected service category is "Other"
    let category = formData.service_category;
    if (category === "Other") {
      category = formData.custom_service_category; // Use custom service category if "Other" selected
    }

    const formDataToSend = {
      ...formData,
      service_category: category, // Update service category with custom value if applicable
    };

    if (isRegistering) {
      // Create FormData instance to send files
      const formDataInstance = new FormData();
      for (const key of Object.keys(formData)) {
        if (
          key === "profile_picture" ||
          key === "video" ||
          key === "work_images" ||
          key === "registration_document"
        ) {
          formDataInstance.append(key, formDataToSend[key]);
        } else {
          formDataInstance.append(key, formDataToSend[key]);
        }
      }

      try {
        const response = await axios.post(
          `/${endpoint}`,
          formDataInstance,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.business_id) {
          // User is logged in
          sessionStorage.setItem("business_id", response.data.business_id);
          setIsLoggedIn(true);
          sendServiceDetailsToBackend();
        } else if (response.data.message) {
          // Registration successful, prompt login
          alert("Registration successful, please log in."); // Optional: Use a more sophisticated notification system
          setIsRegistering(false); // Switch to login mode
          setError(""); // Clear any previous errors
          setFormData({ ...formData, password: "" }); // Clear password (and any other sensitive data)
          
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred. Please try again.");
        }
      }

    } else {
      try {
        const response = await axios.post(
          `/${endpoint}`,
          new URLSearchParams(new FormData(e.target))
        );

        if (response.data.business_id) {
          // User is logged in
          sessionStorage.setItem("business_id", response.data.business_id);
          setIsLoggedIn(true);
          window.location.reload();
        } else if (response.data.error) {
          // Handle errors
          setError(response.data.error);
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred. Please try again.");
      }
    }
  };



  const handleLogout = async () => {
    try {
      await axios.get("/businesslogout");
      sessionStorage.removeItem("business_id");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDashboardAccess = () => {
    navigate("/dashboard"); // Navigate to the "/dashboard" route
  };

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: file,
    }));
  };


  const [serviceProviderInfo, setServiceProviderInfo] = useState({});
  useEffect(() => {
    // Retrieve value from Session storage
    const serviceProviderId = sessionStorage.getItem("business_id");

    // Make API call to fetch service providers
    fetch("/service_provider")
      .then((response) => response.json())
      .then((data) => {
        // Find service provider with matching ID
        const serviceProvider = data.find(
          (provider) => provider.id === parseInt(serviceProviderId)
        );
        if (serviceProvider) {
          setServiceProviderInfo(serviceProvider);
        }
      })
      .catch((error) =>
        console.error("Error fetching service providers:", error)
      );
  }, []);

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
  };

const sendServiceDetailsToBackend = async() =>{
  const serviceProviderId = sessionStorage.getItem('business_id');
  try {
    await axios.post(`/addservices`, {
      service_title: serviceProviderInfo.service_title,
      service_category: serviceProviderInfo.service_category,
      pricing: serviceProviderInfo.pricing,
      hours_available: serviceProviderInfo.hours_available,
      location: serviceProviderInfo.location,
    },{
      headers: {
        "Content-Type": "application/json",
        "ServiceProviderId": serviceProviderId, // Pass service provider ID in headers
      },
    });

  }catch (error) {
    console.error('Error sending message:', error);
    if (error.response) {
      
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    console.error(error.config);
  }
};


const handleServicelisting = () => {
  sendServiceDetailsToBackend();
  sessionStorage.setItem("serviceButtonClicked", "true");
  setServiceButtonClicked(true); // Mark the service list button as clicked
  alert("Your Service has been successfully added to the Home page, please navigate.");
};


  return (
    <div className="business-access-container">
      {isLoggedIn ? (
        <div>
          <div className="user-card">
            {/* Add the user image and name here */}
            <img src={`${serviceProviderInfo.profile_picture_url}` || userImage} alt=""  />
            <span>
              Welcome{" "}
              <span className="green-text">
                {serviceProviderInfo.service_provider}
              </span>
            </span>
          </div>
          <p className="green-text">Business Description:</p>
          <p>{serviceProviderInfo.bio}</p>

          {!serviceButtonClicked && ( // Render the service list button only if it's not clicked
            <button onClick={handleServicelisting}>List your service to Homepage</button>
          )}
          <button onClick={handleDashboardAccess}> Dashboard Access</button>
          
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>{isRegistering ? "Registration" : "Login"} </h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <>
                <input
                  type="text"
                  name="fullname"
                  className="input-field"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="username"
                  className="input-field"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <textarea
                  name="business_description"
                  className="input-field"
                  placeholder="Business Description (minimum 200 characters)"
                  value={formData.business_description}
                  onChange={handleInputChange}
                  rows="12"
                  minLength="200"
                  maxLength="1000"
                />
                <input
                  type="text"
                  name="service_title"
                  className="input-field"
                  placeholder="Service Title"
                  value={formData.service_title}
                  onChange={handleInputChange}
                />
                <select
                  name="service_category"
                  className="input-field"
                  value={formData.service_category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Service Category</option>
                  <option value="Painter">Painter</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Masonry">Masonry</option>
                  <option value="Fitness Professional">
                    Fitness Professional
                  </option>
                  <option value="Nutritionist">Nutritionist</option>
                  <option value="Land scaping">Land scaping</option>
                  <option value="Interior decorator">Interior decorator</option>
                  <option value="Makeup artist">Makeup artist</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Body guard">Body guard</option>
                  <option value="Other">Other</option>{" "}
                  {/* Add "Other" option */}
                  {/* Add more options as needed */}
                </select>
                {/* Display input field only if "Other" is selected */}
                  {formData.service_category === "Other" && (
                    <input
                      type="text"
                      name="custom_service_category"
                      className="input-field"
                      placeholder="Enter custom service category"
                      value={formData.custom_service_category}
                      onChange={handleInputChange}
                    />
                  )}
                
                <input
                  type="number"
                  name="pricing"
                  className="input-field"
                  placeholder="Pricing"
                  value={formData.pricing}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="location"
                  className="input-field"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="hours_available"
                  className="input-field"
                  placeholder="Hours Available (e.g., '8 AM to 5 PM')"
                  value={formData.hours_available}
                  onChange={handleInputChange}
                />
                <label htmlFor="profile_picture">
                  Choose a profile picture:
                </label>
                <input
                  type="file"
                  name="profile_picture"
                  onChange={(e) => handleFileChange(e, "profile_picture")}
                />

                <label htmlFor="video">
                  Choose a video (max 200mb) Optional:
                </label>
                <input
                  type="file"
                  name="video"
                  onChange={(e) => handleFileChange(e, "video")}
                />

                <label htmlFor="work_images">Choose work images:</label>
                <input
                  type="file"
                  name="work_images"
                  onChange={(e) => handleFileChange(e, "work_images")}
                  multiple
                />

                <label htmlFor="registration_document">
                  Choose a registration document (PDF or Jpeg):
                </label>
                <input
                  type="file"
                  name="registration_document"
                  onChange={(e) => handleFileChange(e, "registration_document")}
                />
              </>
            )}
            {/* Inputs for both registration and login */}
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button type="submit">
              {isRegistering ? "Register" : "Login"}
            </button>
          </form>
          <button onClick={switchMode}>
            {isRegistering ? "Switch to Login" : "Switch to Registration"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessLogin;

