import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import { useState } from "react";

const ProductReviewDialog = ({
  open,
  onClose,
  product,
  onAccept,
  onReject,
}) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  const handleReject = () => {
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    onReject(product._id, rejectNote);
    setRejectDialogOpen(false);
    onClose();
    setRejectNote("");
  };

  const handleAccept = () => {
    onAccept(product._id);
    onClose();
  };

  return (
    <>
      {/* Main Product Dialog */}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Product Review</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
              alt={product?.name}
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />

            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              {product.brandName}
            </Typography>
            <Typography variant="body1">Price: {product.price}EGP</Typography>
            <Typography variant="body2" color="text.secondary">
              Category: {product.category?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Description: {product.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created At: {new Date(product.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Instructions:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <ul>
                {product.materialCareInstructions
                  .split("\n")
                  .map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
              </ul>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <ul>
                {product.productSpecificRecommendations
                  .split("\n")
                  .map((point, index) => (
                    <li key={index}>{point.trim()}</li>
                  ))}
              </ul>
            </Typography>
            {/* Add more details as needed */}
          </Box>
        </DialogContent>
        <DialogActions>
          <div className="action-buttons">
            <button className="reject-btn" onClick={handleReject}>
              Reject
            </button>
            <button className="approve-btn" onClick={handleAccept}>
              Accept
            </button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Rejection Note Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      >
        <DialogTitle>Reason for Rejection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Write a reason"
            fullWidth
            variant="outlined"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRejectConfirm}
            disabled={!rejectNote}
            color="error"
            variant="contained"
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductReviewDialog;
