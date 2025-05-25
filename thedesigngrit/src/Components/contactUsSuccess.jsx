import React from "react";
import { IoClose } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const ContactUsSuccess = ({ show, closePopup }) => {
  if (!show) return null;
  return (
    <div className="Job-sent-popup-overlay">
      <div className="Job-sent-popup-container">
        <div className="Job-sent-popup-close-icon" onClick={closePopup}>
          <IoClose />
        </div>
        <div className="mail-icon">
          <FontAwesomeIcon icon={faEnvelope} className="animated-mail-icon" />
        </div>

        <h1>YOUR MESSAGE HAS SENT SUCCESSFULLY!</h1>
        <p>
          Thank you for reaching out! We will respond to your inquiry as soon as
          possible.
        </p>
        <button className="Job-sent-popup-button" onClick={closePopup}>
          Done
        </button>
      </div>
    </div>
  );
};

export default ContactUsSuccess;
