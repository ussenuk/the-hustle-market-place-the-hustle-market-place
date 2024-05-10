

// import React, { useState } from "react";
// import "./aboutUs.css"


// const AboutUs = () => {
//   const [selectedContact, setSelectedContact] = useState(null);

//   const handleButtonClick = (contactType) => {
//     setSelectedContact(contactType);
//   };

//   const renderContactInfo = () => {
//     switch (selectedContact) {
//       case "Contact":
//         return <p>Contact information: XXX-XXX-XXXX</p>;
//       case "Email":
//         return <p>Email: example@example.com</p>;
//       case "Twitter":
//         return <p>Twitter: @example_twitter</p>;
//       case "Instagram":
//         return <p>Instagram: @example_instagram</p>;
//       case "Facebook":
//         return <p>Facebook: facebook.com/example</p>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <h1>About Us</h1>
//       <p>
//         Hutle is an organization started in 2024 with the aim of
//         simplifying people's lives by providing the necessary services available
//         when required.
//       </p>
//       <div className="closeNav" id="closeNav">
//         <button onClick={() => handleButtonClick("Contact")}>Contact</button>
//         <button onClick={() => handleButtonClick("Email")}>Email</button>
//         <button onClick={() => handleButtonClick("Twitter")}>Twitter</button>
//         <button onClick={() => handleButtonClick("Instagram")}>
//           Instagram
//         </button>
//         <button onClick={() => handleButtonClick("Facebook")}>Facebook</button>
//         {/* <button onClick={() => handleButtonClick("Feedback")}>Feedback</button> */}
//       </div>
//       {renderContactInfo()}
//     </div>
//   );
// };

// export default AboutUs;


import React, { useState } from "react";
import "./aboutUs.css";

const AboutUs = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  const handleButtonClick = (contactType) => {
    setSelectedContact(contactType);
  };

  const renderContactInfo = () => {
    switch (selectedContact) {
      case "Contact":
        return <p>Contact us at: XXX-XXX-XXXX</p>;
      case "Email":
        return <p>Email us at: info@hutle.com</p>;
      case "Twitter":
        return <p>Follow us on Twitter: @HutleOfficial</p>;
      case "Instagram":
        return <p>Find us on Instagram: @HutleMarketplace</p>;
      case "Facebook":
        return (
          <p>Connect with us on Facebook: facebook.com/HutleMarketplace</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="about-container">
      <h1>About The Hutle Marketplace</h1>
      <p>
        Welcome to The Hutle Marketplace, your premier destination for
        connecting service providers with users seeking quality and reliable
        services.
      </p>
      <div className="mission">
        <h2>Mission</h2>
        <p>
          To empower every individual to access a wide range of services
          conveniently and efficiently, fostering a community of trust and
          reliability.
        </p>
      </div>
      <div className="vision">
        <h2>Vision</h2>
        <p>
          Our vision is to revolutionize how services are delivered and
          accessed, making The Hutle Marketplace the most trusted platform
          worldwide.
        </p>
      </div>
      <div className="values">
        <h2>Core Values</h2>
        <ul>
          <li>
            <strong>Customer Focus:</strong> We put the needs of our users
            first.
          </li>
          <li>
            <strong>Innovation:</strong> We strive for creative solutions to
            enhance user experiences.
          </li>
          <li>
            <strong>Integrity:</strong> We operate with honesty and uphold
            strong moral principles.
          </li>
          <li>
            <strong>Collaboration:</strong> We believe in the power of teamwork
            to achieve our goals.
          </li>
        </ul>
      </div>
      <div className="contact-buttons" id="closeNav">
        <button onClick={() => handleButtonClick("Contact")}>Contact</button>
        <button onClick={() => handleButtonClick("Email")}>Email</button>
        <button onClick={() => handleButtonClick("Twitter")}>Twitter</button>
        <button onClick={() => handleButtonClick("Instagram")}>
          Instagram
        </button>
        <button onClick={() => handleButtonClick("Facebook")}>Facebook</button>
      </div>
      {renderContactInfo()}
    </div>
  );
};

export default AboutUs;
