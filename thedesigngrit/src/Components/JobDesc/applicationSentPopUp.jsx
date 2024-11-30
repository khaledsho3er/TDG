import React from "react";
import { IoClose } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const ApplicationSentPopup = ({ show, closePopup }) => {
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

        <h1>YOUR APPLICATION HAS SENT SUCCESSFULLY!</h1>
        <p>
          Now, one of our recruiters team will review your application and we
          may call you soon if you fit for the job.
          <br />
          <strong>THANKS.</strong>
        </p>
        <button className="Job-sent-popup-button" onClick={closePopup}>
          Done
        </button>
      </div>
    </div>
  );
};

export default ApplicationSentPopup;
