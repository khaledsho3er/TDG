// RequestInfoPopup.js
import React, { useState, useContext } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import ViewInStorePopup from "./viewInStore";
import RequestQuote from "./RequestInfo";
import { UserContext } from "../../utils/userContext";
import { useNavigate } from "react-router-dom";
const RequestInfoPopup = ({ open, onClose, productId }) => {
  const { userSession } = useContext(UserContext);
  const navigate = useNavigate();
  // Add productId here
  const [isViewInStoreOpen, setIsViewInStoreOpen] = useState(false);
  const [isRequestQuoteOpen, setIsRequestQuoteOpen] = useState(false);

  const handleViewInStoreClick = () => {
    if (!userSession) {
      navigate("/login");
    } else {
      setIsViewInStoreOpen(true);
      onClose();
    }
  };

  const handleCloseViewInStore = () => {
    setIsViewInStoreOpen(false);
  };

  const handleRequestQuoteClick = () => {
    if (!userSession) {
      navigate("/login");
    } else {
      setIsRequestQuoteOpen(true);
      onClose();
    }
  };

  const handleCloseRequestQuote = () => {
    setIsRequestQuoteOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        className="request-popup-dialog"
        classes={{
          paper: "request-popup-paper",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "#2d2d2d",
          }}
        >
          <IoIosClose size={50} />
        </IconButton>
        <DialogTitle className="request-popup-title">
          <h2> Choose an Option</h2>
        </DialogTitle>
        <DialogContent className="request-popup-content">
          <button
            onClick={handleRequestQuoteClick}
            className="request-popup-button"
          >
            Request Quote
          </button>
          <button
            onClick={handleViewInStoreClick}
            className="request-popup-button"
          >
            View in Store
          </button>
        </DialogContent>
      </Dialog>

      {/* ViewInStorePopup */}
      <ViewInStorePopup
        open={isViewInStoreOpen}
        onClose={handleCloseViewInStore}
        productId={productId}
      />

      {/* RequestQuote Popup */}
      {isRequestQuoteOpen && (
        <RequestQuote onClose={handleCloseRequestQuote} productId={productId} />
      )}
    </>
  );
};

export default RequestInfoPopup;
