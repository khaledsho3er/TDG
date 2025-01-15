import React, { useState } from "react";
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

const ViewInStorePopup = ({ open, onClose }) => {
  const [confirmationMessage, setConfirmationMessage] = useState(false);

  const productInfo = {
    code: "123456", // Replace with dynamic code generation
    userName: "John Doe",
    productImage: "/Assets/sofabrown.jpg", // Replace with product image URL
    vendorLogo: "/Assets/Vendors/Istkbal/istikbal-logo.png", // Replace with vendor logo URL
    vendorName: "Vendor Name",
  };

  const handleSubmit = () => {
    // Simulate form submission logic (e.g., saving data to backend)
    setConfirmationMessage(true);
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
              Your Purchase Code: {productInfo.code}
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
                Purchase Code: {productInfo.code}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <img
                    src={productInfo.productImage}
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
                    Product Name: Example Product
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#6b7b58" }}>
                      Vendor: {productInfo.vendorName}
                    </Typography>
                    <img
                      src={productInfo.vendorLogo}
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
