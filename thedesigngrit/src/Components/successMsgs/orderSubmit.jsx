import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSentPopup = ({ show: propShow, closePopup: propClosePopup }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(propShow || false);

  useEffect(() => {
    // Check URL parameters for success
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("order");
    const status = searchParams.get("status");

    if (orderId && status === "success") {
      setShow(true);
      // Clear the URL parameters without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const handleClose = () => {
    setShow(false);
    if (propClosePopup) {
      propClosePopup();
    }
  };

  if (!show) return null;

  return (
    <div className="Job-sent-popup-overlay">
      <div className="Job-sent-popup-container">
        <div className="Job-sent-popup-close-icon" onClick={handleClose}>
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
            <strong>THANKS,</strong> For Choosing us.
            <br />
          </p>
        </div>
        <button
          className="Job-sent-popup-button"
          onClick={() => {
            navigate("/");
            handleClose();
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default OrderSentPopup;
