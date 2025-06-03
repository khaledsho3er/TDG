import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MdLocationOn } from "react-icons/md";
import { UserContext } from "../../utils/userContext";
import ShippingInfoPopup from "../profilePopup/Shipping";
import axios from "axios";

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  maxWidth: "90%",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  padding: theme.spacing(4),
  maxHeight: "90vh",
  overflow: "auto",
}));

const AddressCard = styled(Card)(({ theme, isSelected }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  position: "relative",
  border: isSelected ? `2px solid #2d2d2d` : "1px solid #e0e0e0",
  transition: "transform 0.2s ease-in-out, border 0.2s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
    border: `2px solid #2d2d2d`,
  },
}));

// const ActionButton = styled(Button)(({ theme }) => ({
//   marginTop: theme.spacing(2),
//   backgroundColor: "#2d2d2d",
//   color: "white",
//   padding: "10px 20px",
//   borderRadius: "8px",
//   "&:hover": {
//     backgroundColor: "#555555",
//   },
// }));

const AddressSelectionPopup = ({ open, onClose, onAddressSelect }) => {
  const { userSession } = useContext(UserContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showAddNewForm, setShowAddNewForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchAddresses();
    }
  }, [open, userSession.id]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.thedesigngrit.com/api/getUserById/${userSession.id}`,
        { withCredentials: true }
      );

      if (response.data && response.data.shipmentAddress) {
        setAddresses(response.data.shipmentAddress);

        // Auto-select default address if exists
        const defaultIndex = response.data.shipmentAddress.findIndex(
          (addr) => addr.isDefault === true
        );

        if (defaultIndex !== -1) {
          setSelectedAddressIndex(defaultIndex);
        } else if (response.data.shipmentAddress.length > 0) {
          setSelectedAddressIndex(0);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressClick = (index) => {
    setSelectedAddressIndex(index);
  };

  const handleConfirm = () => {
    if (selectedAddressIndex !== null && addresses[selectedAddressIndex]) {
      onAddressSelect(addresses[selectedAddressIndex]);
      onClose();
    }
  };

  const handleAddNew = () => {
    setShowAddNewForm(true);
  };

  const handleAddressAdded = () => {
    setShowAddNewForm(false);
    fetchAddresses();
  };

  // If showing the add new form
  if (showAddNewForm) {
    return (
      <Modal open={open} onClose={() => setShowAddNewForm(false)}>
        <ModalBox sx={{ width: 900 }}>
          <Button
            onClick={() => setShowAddNewForm(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#2d2d2d",
            }}
          >
            Back to Addresses
          </Button>
          <ShippingInfoPopup onAddressAdded={handleAddressAdded} />
        </ModalBox>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontFamily: "Horizon",
            textAlign: "center",
            marginBottom: 3,
          }}
        >
          Select Shipping Address
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography>Loading your addresses...</Typography>
          </Box>
        ) : addresses.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              minHeight: "200px",
            }}
          >
            <MdLocationOn size={48} color="#2d2d2d" />
            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
              You don't have any saved addresses yet
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Add a shipping address to continue with checkout
            </Typography>
            <Button
              variant="contained"
              onClick={handleAddNew}
              sx={{
                backgroundColor: "#2d2d2d",
                "&:hover": { backgroundColor: "#555555" },
              }}
            >
              Add Your First Address
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {addresses.map((addr, index) => (
                <Grid item xs={12} key={index}>
                  <AddressCard
                    isSelected={selectedAddressIndex === index}
                    onClick={() => handleAddressClick(index)}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ mb: 1, fontWeight: "bold" }}
                      >
                        {addr.label || "Address " + (index + 1)}
                        {addr.isDefault && (
                          <span
                            style={{
                              backgroundColor: "transparent",
                              color: "#2d2d2d",
                              borderRadius: "4px",
                              padding: "5px 10px",
                              fontSize: "15px",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              marginLeft: "10px",
                            }}
                          >
                            Default
                          </span>
                        )}
                      </Typography>

                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {addr.address1}
                        {addr.address2 && `, ${addr.address2}`}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {addr.apartment && `Apt ${addr.apartment}, `}
                        {addr.floor && `Floor ${addr.floor}, `}
                        {addr.landmark && `Near ${addr.landmark}`}
                      </Typography>

                      <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {addr.city}, {addr.postalCode}
                      </Typography>

                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {addr.country}
                      </Typography>
                    </CardContent>
                  </AddressCard>
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="outlined"
                onClick={handleAddNew}
                sx={{
                  borderColor: "#2d2d2d",
                  color: "#2d2d2d",
                  "&:hover": {
                    borderColor: "#555555",
                    backgroundColor: "rgba(45, 45, 45, 0.04)",
                  },
                }}
              >
                Add New Address
              </Button>

              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={selectedAddressIndex === null}
                sx={{
                  backgroundColor: "#2d2d2d",
                  "&:hover": { backgroundColor: "#555555" },
                  "&.Mui-disabled": {
                    backgroundColor: "#cccccc",
                  },
                }}
              >
                Use Selected Address
              </Button>
            </Box>
          </>
        )}
      </ModalBox>
    </Modal>
  );
};

export default AddressSelectionPopup;
