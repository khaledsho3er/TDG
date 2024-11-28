import React from "react";
import Header from "../Components/navBar";
import { Box } from "@mui/material";
function ContactUs() {
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
          <form className="Contact-form-content">
            <div className="contact-form-field">
              <label for="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="contact-form-field">
              <label for="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="jhondoe@gmail.com"
                required
              />
            </div>
            <div className="contact-form-field">
              <label for="subject">Subject:</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                required
              />
            </div>
            <div className="contact-form-field">
              <label for="message">Message:</label>
              <textarea
                id="message"
                name="message"
                placeholder="Type your message here..."
                required
              />
            </div>
            <button
              type="submit"
              id="submit-btn"
              name="submit-btn"
              className="contact-submit-btn"
            >
              {" "}
              Submit
            </button>
          </form>
        </Box>
      </div>
    </Box>
  );
}
export default ContactUs;
