import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import { IoIosClose } from "react-icons/io";
import ViewInStorePopup from "./viewInStore"; // Import the ViewInStorePopup
import RequestQuote from "./RequestInfo"; // Import the RequestQuote component

const RequestInfoPopup = ({ open, onClose, onOptionSelect }) => {
  const [isViewInStoreOpen, setIsViewInStoreOpen] = useState(false);
  const [isRequestQuoteOpen, setIsRequestQuoteOpen] = useState(false); // New state for RequestQuote visibility

  const handleViewInStoreClick = () => {
    setIsViewInStoreOpen(true);
    onClose(); // Close the RequestInfoPopup when 'View in Store' is clicked
  };

  const handleCloseViewInStore = () => {
    setIsViewInStoreOpen(false);
  };

  const handleRequestQuoteClick = () => {
    setIsRequestQuoteOpen(true); // Open RequestQuote component
    onClose(); // Close the RequestInfoPopup
  };

  const handleCloseRequestQuote = () => {
    setIsRequestQuoteOpen(false); // Close the RequestQuote component
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        sx={{
          zIndex: 1000,
          backdropFilter: "blur(4px)",
          "& .MuiPaper-root": {
            width: "80%",
            height: "80%",
            borderRadius: "20px",
            padding: "20px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#faf9f6",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
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
          sx={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            color: "#2d2d2d",
          }}
        >
          Choose an Option
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <Button
            onClick={handleRequestQuoteClick} // Open RequestQuote and close RequestInfoPopup
            sx={{
              fontSize: "24px",
              fontWeight: "bold",
              backgroundColor: "#6b7b58",
              color: "#fbf7f5",
              width: "30%",
              height: "280px",
              borderRadius: "16px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#2d2d2d",
              },
            }}
          >
            Request Quote
          </Button>
          <Button
            onClick={handleViewInStoreClick} // Open ViewInStorePopup and close RequestInfoPopup
            sx={{
              fontSize: "24px",
              fontWeight: "bold",
              backgroundColor: "#6b7b58",
              color: "#fbf7f5",
              width: "30%",
              height: "280px",
              borderRadius: "16px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#2d2d2d",
              },
            }}
          >
            View in Store
          </Button>
        </DialogContent>
      </Dialog>

      {/* ViewInStorePopup */}
      <ViewInStorePopup
        open={isViewInStoreOpen}
        onClose={handleCloseViewInStore}
      />

      {/* RequestQuote Popup */}
      {isRequestQuoteOpen && <RequestQuote onClose={handleCloseRequestQuote} />}
    </>
  );
};

export default RequestInfoPopup;
