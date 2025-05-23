import React from "react";
import { IoClose } from "react-icons/io5";
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
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="mail-icon"
            style={{ width: "100px", height: "100px" }}
          >
            <img
              src={"Assets/orderIconCycle.gif"}
              alt="animated delivery icon"
              className="animated-mail-icon"
              style={{ width: "100%", height: "100%" }}
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
            navigate("/");
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
