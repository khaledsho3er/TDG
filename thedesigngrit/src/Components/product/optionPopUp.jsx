// RequestInfoPopup.js
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import ViewInStorePopup from "./viewInStore";
import RequestQuote from "./RequestInfo";

const RequestInfoPopup = ({ open, onClose, productId }) => {
  // Add productId here
  const [isViewInStoreOpen, setIsViewInStoreOpen] = useState(false);
  const [isRequestQuoteOpen, setIsRequestQuoteOpen] = useState(false);

  const handleViewInStoreClick = () => {
    setIsViewInStoreOpen(true);
    onClose();
  };

  const handleCloseViewInStore = () => {
    setIsViewInStoreOpen(false);
  };

  const handleRequestQuoteClick = () => {
    setIsRequestQuoteOpen(true);
    onClose();
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
      />

      {/* RequestQuote Popup */}
      {isRequestQuoteOpen && (
        <RequestQuote onClose={handleCloseRequestQuote} productId={productId} />
      )}
    </>
  );
};

export default RequestInfoPopup;
