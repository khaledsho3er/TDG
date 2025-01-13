import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Button,
} from "@mui/material";

const RequestInfoPopup = ({ open, onClose, onOptionSelect }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 1000,
        position: "fixed",
        backdropFilter: "blur(4px)",
        "& .MuiPaper-root": {
          borderRadius: "16px",
          backdropFilter: "blur(5px)",
          backgroundColor: "#efeded",
        },
      }}
    >
      <DialogTitle
        style={{
          fontWeight: "normal",
          backgroundColor: "#efeded",
          color: "#2d2d2d",
          paddingLeft: "16px",
          border: "none",
        }}
      >
        Choose an Option
      </DialogTitle>
      <DialogContent
        style={{
          fontWeight: "bold",
          backgroundColor: "#efeded",
          color: "#2d2d2d",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "8px",
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            backgroundColor: "#efeded",
            color: "#2d2d2d",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "8px",
          }}
        >
          <Button
            onClick={() => onOptionSelect("quote")}
            fullWidth
            sx={{
              backgroundColor: "#6b7b58",
              color: "#f5f5f5",
              width: "100%",
              marginBottom: "8px",
              "&:hover": {
                backgroundColor: "#2d2d2d",
                color: "#f5f5f5",
              },
            }}
          >
            Request Quote
          </Button>
          <Button
            onClick={() => onOptionSelect("viewInStore")}
            fullWidth
            sx={{
              backgroundColor: "#6b7b58",
              color: "#f5f5f5",
              "&:hover": {
                backgroundColor: "#2d2d2d",
                color: "#f5f5f5",
              },
            }}
          >
            View <br />
            in Store
          </Button>
        </Box>
      </DialogContent>
      <DialogActions
        style={{
          fontWeight: "bold",
          backgroundColor: "#efeded",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "#2d2d2d",
            border: "none",
            "&:hover": {
              backgroundColor: "#2d2d2d",
              border: "none",
              color: "#f5f5f5",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestInfoPopup;
