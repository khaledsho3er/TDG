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
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "../../utils/userContext";

const ViewInStorePopup = ({ open, onClose, productId }) => {
  const [confirmationMessage, setConfirmationMessage] = useState(false);
  const { userSession } = useContext(UserContext);
  const isMobile = useMediaQuery("(max-width:768px)");
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
            code,
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
          width: isMobile ? "100%" : "80%",
          borderRadius: "20px",
          padding: isMobile ? "16px" : "24px",
          position: "relative",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
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
          color: "#fff",
          background: "rgba(0,0,0,0.2)",
          "&:hover": {
            background: "rgba(0,0,0,0.3)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        {confirmationMessage ? "Submission Successful" : "Confirm Your Details"}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "0px" : "24px",
        }}
      >
        {confirmationMessage ? (
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                marginBottom: "16px",
              }}
              gutterBottom
            >
              Your Purchase Code: {code}
            </Typography>
            <Typography variant="h6" sx={{ color: "#a5ffab" }}>
              Your information has been submitted successfully!
            </Typography>
          </Box>
        ) : (
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
                gutterBottom
              >
                Purchase Code: {code}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <img
                    src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${productId.mainImage}`}
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
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  >
                    Product Name: {productId.name}
                  </Typography>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="body2" sx={{ color: "#cce7c9" }}>
                      Vendor: {productId.brandId.brandName}
                    </Typography>
                    <img
                      src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${productId.brandId.brandlogo}`}
                      alt="Vendor Logo"
                      style={{ width: "100px", height: "auto" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
            <CardContent sx={{ textAlign: "center" }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  backgroundColor: "#6b7b58",
                  color: "#fff",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#839871",
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
