import React, { useState } from "react";
import Header from "../Components/navBar";
import { Box } from "@mui/material";
import ApplicationSentPopup from "../Components/JobDesc/applicationSentPopUp";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "", // changed from fullName to name
    email: "",
    subject: "",
    message: "",
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Control popup visibility

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setIsPopupVisible(true); // Show popup on form submission
  };

  const closePopup = () => {
    setIsPopupVisible(false); // Close the popup
  };

  return (
    <Box className="Contact-Page">
      <Header />

      <div className="content-container">
        <Box className="Contant-caption">
          <h3>Let's Talk.</h3>
          <p>
            Whether it's to discuss your next project or just to say hi, <br />
            feel free to reach out to me. I'm excited to hear from you.
          </p>
        </Box>

        <Box className="Contact-form">
          <form onSubmit={handleSubmit} className="Contact-form-content">
            <div className="contact-form-field">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name" // this should match the formData key
                placeholder="John Doe"
                value={formData.name} // use formData.name for value
                onChange={handleInputChange}
              />
            </div>

            <div className="contact-form-field">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email" // this should match the formData key
                placeholder="jhondoe@gmail.com"
                value={formData.email} // use formData.email for value
                onChange={handleInputChange}
              />
            </div>

            <div className="contact-form-field">
              <label htmlFor="subject">Subject:</label>
              <input
                type="text"
                id="subject"
                name="subject" // this should match the formData key
                placeholder="Subject"
                value={formData.subject} // use formData.subject for value
                onChange={handleInputChange}
              />
            </div>

            <div className="contact-form-field">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message" // this should match the formData key
                placeholder="Type your message here..."
                value={formData.message} // use formData.message for value
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              id="submit-btn"
              name="submit-btn"
              className="contact-submit-btn"
            >
              Submit
            </button>
          </form>
        </Box>
      </div>
      <ApplicationSentPopup show={isPopupVisible} closePopup={closePopup} />
    </Box>
  );
}

export default ContactUs;
