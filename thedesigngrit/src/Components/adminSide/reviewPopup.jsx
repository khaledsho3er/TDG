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
              src={product?.mainImage?.url}
              alt={product?.title}
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
            <Typography variant="h6">{product.title}</Typography>
            <Typography variant="body1">Price: ${product.price}</Typography>
            <Typography variant="body2" color="text.secondary">
              Category: {product.category?.name}
            </Typography>
            {/* Add more details as needed */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReject} color="error" variant="outlined">
            Reject
          </Button>
          <Button onClick={handleAccept} color="primary" variant="contained">
            Accept
          </Button>
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
