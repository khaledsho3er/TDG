import React, { useState } from "react";
import Header from "../Components/navBar";
import { Box } from "@mui/material";
import ContactUsSuccess from "../Components/contactUsSuccess";
import Footer from "../Components/Footer";
import * as Yup from "yup"; // Import Yup for validation

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [errors, setErrors] = useState({}); // Store error messages

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required."),
    email: Yup.string()
      .email("Invalid email address.")
      .required("Email is required."),
    subject: Yup.string().required("Subject is required."),
    message: Yup.string().required("Message is required."),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      return true; // Validation passed
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors); // Set error messages
      return false; // Validation failed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateForm(); // Validate the form
    if (!isValid) return; // Stop submission if validation fails

    try {
      const response = await fetch(
        "https://api.thedesigngrit.com/api/contactus/contact",
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
      }
    } catch (error) {
      console.error("Error:", error);
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
          <h3>Need to reach out?</h3>
          <p>
            Get in contact with us through our email form and we will get back
            to you as soon as we can!
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
              {errors.name && <p className="error-message">{errors.name}</p>}{" "}
              {/* Display error */}
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
              {errors.email && <p className="error-message">{errors.email}</p>}{" "}
              {/* Display error */}
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
              {errors.subject && (
                <p className="error-message">{errors.subject}</p>
              )}{" "}
              {/* Display error */}
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
              {errors.message && (
                <p className="error-message">{errors.message}</p>
              )}{" "}
              {/* Display error */}
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
      <ContactUsSuccess show={isPopupVisible} closePopup={closePopup} />
      <Footer />
    </Box>
  );
}

export default ContactUs;
