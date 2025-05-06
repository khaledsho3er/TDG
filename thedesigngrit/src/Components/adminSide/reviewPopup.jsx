import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
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
              style={{
                width: "100%",
                height: "240px",
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <Typography variant="h6">Name:{product.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              {product.brandName}
            </Typography>
            <Typography variant="body1">Price: {product.price}EGP</Typography>
            <Typography variant="body2" color="text.secondary">
              <span style={{ fontWeight: "bold" }}>Category:</span> Category:{" "}
              {product.category?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <span style={{ fontWeight: "bold" }}>Description:</span>{" "}
              {product.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <span style={{ fontWeight: "bold" }}>Created At:</span> Created
              At: {new Date(product.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Material Care Instructions:
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
            <Typography variant="body1" color="text.secondary">
              Product Specific Recommendations:
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
        <DialogActions sx={{ justifyContent: "center" }}>
          <div className="action-buttons">
            <button className="approve-btn" onClick={handleAccept}>
              Accept
            </button>
            <button className="reject-btn" onClick={handleReject}>
              Reject
            </button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Rejection Note Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Reason for Rejection
          <IconButton
            aria-label="close"
            onClick={() => setRejectDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Write a reason"
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <button
            onClick={() => setRejectDialogOpen(false)}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleRejectConfirm}
            disabled={!rejectNote}
            className="reject-btn"
          >
            Confirm Rejection
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductReviewDialog;
