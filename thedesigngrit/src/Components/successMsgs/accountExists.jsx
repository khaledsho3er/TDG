import React from "react";
import { IoClose } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const AccountExistsPopup = ({ show, closePopup }) => {
  if (!show) return null;
  return (
    <div className="Job-sent-popup-overlay">
      <div className="Job-sent-popup-container">
        <div className="Job-sent-popup-close-icon" onClick={closePopup}>
          <IoClose />
        </div>
        <div className="mail-icon">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className="animated-mail-icon"
            style={{ color: "#ff6b6b" }}
          />
        </div>

        <h1>ACCOUNT ALREADY EXISTS!</h1>
        <p>
          An account with this email address already exists.
          <br />
          Please try logging in instead.
        </p>
        <button className="Job-sent-popup-button" onClick={closePopup}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AccountExistsPopup;
