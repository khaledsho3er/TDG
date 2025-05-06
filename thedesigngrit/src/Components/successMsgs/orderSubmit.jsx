import React from "react";
import { IoClose } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const OrderSentPopup = ({ show, closePopup }) => {
  const navigate = useNavigate();
  if (!show) return null;
  return (
    <div className="Job-sent-popup-overlay">
      <div className="Job-sent-popup-container">
        <div className="Job-sent-popup-close-icon" onClick={closePopup}>
          <IoClose />
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="mail-icon">
            <img
              src={"Assets/orderIcon.gif"}
              alt="animated delivery icon"
              className="animated-mail-icon"
            />
            {/* <TbTruckDelivery className="animated-mail-icon" /> */}
          </div>

          <h1>YOUR ORDER HAS BEEN SUBMITTED SUCCESSFULLY!</h1>
          <p>
            <strong>THANKS,</strong> For Chosing us.
            <br />
          </p>
        </div>
        <button
          className="Job-sent-popup-button"
          onClick={() => {
            setTimeout(() => {
              navigate("/");
            }, 3000); // Redirect or show confirmation
            closePopup();
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default OrderSentPopup;
