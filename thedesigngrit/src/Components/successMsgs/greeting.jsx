import React from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

const GreetingModal = ({ email, onClose }) => {
  return (
    <div className="greeting-overlay">
      <div className="greeting-modal">
        <div className="greeting-left">
          <img
            src="/Assets/greeting.png" // Replace with your image path
            alt="Newsletter"
            className="greeting-image"
          />
        </div>
        <div className="greeting-right">
          <button className="greeting-close" onClick={onClose}>
            &times;
          </button>
          <FaRegCircleCheck />
          <h2 className="greeting-title">Thank you for subscribing!</h2>
          <p className="greeting-text">
            We have sent you an offer to <strong>{email}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GreetingModal;
