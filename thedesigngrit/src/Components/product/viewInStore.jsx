import React, { useState, useRef, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../utils/userContext";

const ViewInStorePopup = ({ open, onClose, productId }) => {
  const [confirmationMessage, setConfirmationMessage] = useState(false);
  const { userSession } = useContext(UserContext);
  const code = useRef(
    Math.random().toString(36).substring(2, 10) +
      new Date().getTime().toString(36)
  ).current;
  const prodId = productId;
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://tdg-db.onrender.com/api/view-in-store/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: code,
            productId: prodId,
            userId: userSession.id,
            userName: `${userSession?.firstName || ""} ${
              userSession?.lastName || ""
            }`.trim(),
            brandId: productId.brandId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("ViewInStore entry created:", data);
        setConfirmationMessage(true);
      } else {
        const error = await response.json();
        console.error("Failed to create ViewInStore entry:", error);
        alert("Error: " + error.message || "Failed to submit information.");
      }
    } catch (err) {
      console.error("Request error:", err);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        zIndex: 1000,
        "& .MuiPaper-root": {
          width: "80%",
          borderRadius: "20px",
          padding: "20px",
          position: "relative",
          overflow: "visible",
          backgroundColor: "#faf9f6",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Close Icon */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
          color: "#6b7b58",
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#2d2d2d",
        }}
      >
        {confirmationMessage ? "Submission Successful" : "Confirm Your Details"}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
        }}
      >
        {confirmationMessage ? (
          <div>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#2d2d2d",
                textAlign: "center",
                left: "16px",
                marginBottom: "16px",
              }}
              gutterBottom
            >
              Your Purchase Code: {code}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "green",
                textAlign: "center",
              }}
            >
              Your information has been submitted successfully!
            </Typography>
          </div>
        ) : (
          <Card
            sx={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "16px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#2d2d2d",
                  textAlign: "center",
                  left: "16px",
                  marginBottom: "16px",
                }}
                gutterBottom
              >
                Purchase Code: {code}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <img
                    src={`https://tdg-db.onrender.com/uploads/${productId.mainImage}`}
                    alt="Product"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="body1"
                    sx={{ color: "#2d2d2d", fontWeight: "bold" }}
                  >
                    Product Name: {productId.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#6b7b58" }}>
                      Vendor: {productId.brandName}
                    </Typography>
                    <img
                      src={`https://tdg-db.onrender.com/uploads/${productId.brandId.brandlogo}`}
                      alt="Vendor Logo"
                      style={{ width: "100px", height: "auto" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
            <CardContent
              sx={{
                textAlign: "center",
                padding: "16px",
                borderRadius: "0 0 16px 16px",
              }}
            >
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  backgroundColor: "#2d2d2d",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#6b7b58",
                  },
                }}
              >
                Submit Information
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewInStorePopup;
