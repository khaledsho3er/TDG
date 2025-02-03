import React, { useState } from "react";
import Header from "../Components/navBar";
import { Box } from "@mui/material";
import ApplicationSentPopup from "../Components/JobDesc/applicationSentPopUp";
import Footer from "../Components/Footer";
function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/contactus/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Convert form data to JSON
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Message sent successfully:", result);
        setIsPopupVisible(true); // Show the popup if the message was sent successfully

        // Reset the form data after successful submission
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        console.error("Error sending message:", result);
        alert("There was an error sending your message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error sending your message. Please try again.");
    }
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
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="contact-form-field">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="jhondoe@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="contact-form-field">
              <label htmlFor="subject">Subject:</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>

            <div className="contact-form-field">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                placeholder="Type your message here..."
                value={formData.message}
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
      <Footer />
    </Box>
  );
}

export default ContactUs;
