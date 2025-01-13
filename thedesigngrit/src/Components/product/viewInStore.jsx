import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";

const ViewInStorePopup = ({ open, onClose }) => {
  const [confirmationMessage, setConfirmationMessage] = useState(false);

  const productInfo = {
    code: "123456", // Replace with dynamic code generation
    userName: "John Doe",
    productImage: "https://via.placeholder.com/150", // Replace with product image URL
    vendorLogo: "https://via.placeholder.com/50", // Replace with vendor logo URL
    vendorName: "Vendor Name",
  };

  const handleSubmit = () => {
    // Simulate form submission logic (e.g., saving data to backend)
    setConfirmationMessage(true);
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ zIndex: 1000 }}>
      <DialogTitle
        sx={{
          backgroundColor: "#6b7b58",
          color: "white",
          padding: "16px",
        }}
      >
        <Typography variant="h6">Confirm Your Details</Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "#f5f5f5",
          backdropFilter: "blur(5px)",
          padding: "20px",
          borderRadius: "16px",
        }}
      >
        {confirmationMessage ? (
          <Typography variant="h6" color="green">
            Your information has been submitted successfully!
          </Typography>
        ) : (
          <Card
            sx={{ maxWidth: 500, margin: "0 auto", backgroundColor: "#fefefe" }}
          >
            <CardContent>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                Purchase Code: {productInfo.code}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <img
                    src={productInfo.productImage}
                    alt="Product"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "8px",
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body1" color="textSecondary">
                    Product Name: Example Product
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Vendor: {productInfo.vendorName}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardContent
              sx={{
                backgroundColor: "#6b7b58",
                textAlign: "center",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                sx={{ color: "white" }}
              >
                Submit Information
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#6b7b58",
          padding: "16px",
        }}
      >
        <Button onClick={onClose} sx={{ color: "white" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewInStorePopup;
