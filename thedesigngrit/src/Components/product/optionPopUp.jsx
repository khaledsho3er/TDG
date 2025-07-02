// RequestInfoPopup.js
import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { IoIosClose } from "react-icons/io";
import ViewInStorePopup from "./viewInStore";
import RequestQuote from "./RequestInfo";
import { UserContext } from "../../utils/userContext";
import { useNavigate } from "react-router-dom";
const RequestInfoPopup = ({ open, onClose, productId }) => {
  const { userSession } = useContext(UserContext);
  const isMobile = useMediaQuery("(max-width:768px)");
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
        PaperProps={{
          sx: {
            backdropFilter: "blur(12px)",
            // backgroundColor: "rgba(255, 255, 255, 0.15)",
            backgroundColor: "white",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          },
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
        <DialogTitle
          className="request-popup-title"
          sx={{
            color: "#fff",
            textAlign: "center",
            fontWeight: 600,
            fontSize: "24px",
            paddingTop: "32px",
          }}
        >
          <h2
            style={{ color: "#2d2d2d", fontSize: isMobile ? "16px" : "24px" }}
          >
            {" "}
            Choose an Option
          </h2>
        </DialogTitle>
        <DialogContent
          className="request-popup-content"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "32px",
          }}
        >
          <button
            onClick={handleRequestQuoteClick}
            className="request-popup-button"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              borderRadius: "12px",
              padding: "12px 24px",
              color: "#2d2d2d",
              fontWeight: "500",
              cursor: "pointer",
              width: isMobile ? "100%" : "40%",
            }}
          >
            Request Quote
          </button>
          <button
            onClick={handleViewInStoreClick}
            className="request-popup-button"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              borderRadius: "12px",
              padding: "12px 24px",
              color: "#2d2d2d",
              fontWeight: "500",
              cursor: "pointer",
              width: isMobile ? "100%" : "40%",
            }}
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
