import React from "react";
import { IoClose } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const AccountSentPopup = ({ show, closePopup }) => {
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

        <h1>YOUR ACCOUNT HAS BEEN CREATED SUCCESSFULLY!</h1>
        <p>
          Now, Enjoy our services.
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

export default AccountSentPopup;
