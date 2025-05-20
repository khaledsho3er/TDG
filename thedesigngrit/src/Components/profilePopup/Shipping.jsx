import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import countryList from "react-select-country-list";
import ConfirmationDialog from "../confirmationMsg";
import { UserContext } from "../../utils/userContext";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MdLocationOn } from "react-icons/md";

// Styled components
const AddressCard = styled(Card)(({ theme, isDefault }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  position: "relative",
  border: isDefault ? `2px solid #2d2d2d` : "none",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
  },
}));

const DefaultChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#2d2d2d",
  color: "white",
  fontWeight: "bold",
  marginRight: "auto", // Push to the left
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  backgroundColor: "#2d2d2d",
  color: "white",
  "&:hover": {
    backgroundColor: "#555555",
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: "#2d2d2d",
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#555555",
  },
}));

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxWidth: "90%",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  padding: theme.spacing(4),
  maxHeight: "90vh",
  overflow: "auto",
}));

const ShippingInfoPopup = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ shipmentAddress: [] });
  const [newAddress, setNewAddress] = useState({
    address1: "",
    address2: "",
    label: "",
    floor: "",
    apartment: "",
    landmark: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const { userSession } = useContext(UserContext);
  const [countries] = useState(countryList().getData());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.thedesigngrit.com/api/getUserById/${userSession.id}`,
          { withCredentials: true }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userSession.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setNewAddress((prev) => ({
      ...prev,
      country: selectedOption.label,
    }));
  };

  const handleEditAddress = (index) => {
    setSelectedAddressIndex(index);
    setNewAddress(userData.shipmentAddress[index]);
    setIsEditing(true);
  };

  const handleAddNewAddress = () => {
    setNewAddress({
      address1: "",
      address2: "",
      label: "",
      floor: "",
      apartment: "",
      landmark: "",
      city: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });
    setSelectedAddressIndex(null);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    setDialogOpen(true);
  };

  const handleDeleteAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `https://api.thedesigngrit.com/api/removeAddress/${userSession.id}/${selectedAddressId}`,
        { withCredentials: true }
      );

      setUserData((prev) => ({
        ...prev,
        shipmentAddress: response.data.shipmentAddress,
      }));

      // Use a more elegant notification instead of alert
      // You could implement a snackbar here
    } catch (error) {
      console.error("Error removing address:", error);
    }
    setDeleteDialogOpen(false);
  };

  const handleConfirm = async () => {
    try {
      // Validate required fields
      if (
        !newAddress.address1 ||
        !newAddress.city ||
        !newAddress.country ||
        !newAddress.postalCode
      ) {
        alert(
          "Please fill in all required fields: Address, City, Country, and Postal Code"
        );
        return;
      }

      let updatedAddresses = [...userData.shipmentAddress];

      // If setting as default, update all other addresses
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      }

      if (selectedAddressIndex !== null) {
        updatedAddresses[selectedAddressIndex] = {
          ...updatedAddresses[selectedAddressIndex],
          ...newAddress,
          isDefault: newAddress.isDefault ? "Default" : false,
        };
      } else {
        updatedAddresses.push({
          ...newAddress,
          isDefault: newAddress.isDefault ? "Default" : false,
        });
      }

      await axios.put(
        `https://api.thedesigngrit.com/api/updateUser/${userSession.id}`,
        { shipmentAddress: updatedAddresses },
        { withCredentials: true }
      );

      setUserData((prev) => ({
        ...prev,
        shipmentAddress: updatedAddresses,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
    setDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDialogOpen(false);
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "900px", margin: "0 auto" }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontFamily: "Horizon",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        Shipping Addresses
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <Typography>Loading your addresses...</Typography>
        </Box>
      ) : userData.shipmentAddress.length === 0 ? (
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
            Add a shipping address to make checkout faster
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddNewAddress}
            sx={{
              backgroundColor: "#2d2d2d",
              "&:hover": { backgroundColor: "#555555" },
            }}
          >
            Add Your First Address
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {userData.shipmentAddress.map((addr, index) => (
            <Grid item xs={12} md={6} key={index}>
              <AddressCard isDefault={addr.isDefault === "Default"}>
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ mb: 1, fontWeight: "bold" }}
                  >
                    {addr.label || "Address " + (index + 1)}
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

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {addr.isDefault === "Default" && (
                      <DefaultChip label="Default" size="small" />
                    )}
                    <Box sx={{ display: "flex", marginLeft: "auto" }}>
                      <ActionButton
                        onClick={() => handleEditAddress(index)}
                        size="small"
                      >
                        Edit
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDeleteAddress(addr._id)}
                        size="small"
                      >
                        Remove
                      </ActionButton>
                    </Box>
                  </Box>
                </CardContent>
              </AddressCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <AddButton onClick={handleAddNewAddress}>Add New Address</AddButton>
      </Box>

      <Modal open={isEditing} onClose={handleCancel}>
        <ModalBox>
          <Typography
            variant="h5"
            component="h2"
            align="center"
            sx={{ mb: 3, fontFamily: "Horizon" }}
          >
            {selectedAddressIndex !== null ? "Edit Address" : "Add New Address"}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address Line 1*"
                name="address1"
                value={newAddress.address1}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="address2"
                value={newAddress.address2}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Label (e.g. Home, Work)"
                name="label"
                value={newAddress.label}
                onChange={handleInputChange}
                placeholder="Home, Work, etc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apartment/Suite"
                name="apartment"
                value={newAddress.apartment}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Floor"
                name="floor"
                value={newAddress.floor}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Landmark"
                name="landmark"
                value={newAddress.landmark}
                onChange={handleInputChange}
                placeholder="Nearby landmark"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City*"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                options={countries}
                onChange={handleCountryChange}
                placeholder="Select your country*"
                isSearchable
                value={
                  countries.find((c) => c.label === newAddress.country) || null
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "56px",
                    minHeight: "56px",
                  }),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code*"
                name="postalCode"
                value={newAddress.postalCode}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newAddress.isDefault}
                    onChange={(e) => {
                      setNewAddress((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }));
                    }}
                  />
                }
                label="Set as Default Address"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                width: "48%",
                borderColor: "#2d2d2d",
                color: "#2d2d2d",
                "&:hover": {
                  borderColor: "#555555",
                  backgroundColor: "rgba(45, 45, 45, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              sx={{
                width: "48%",
                backgroundColor: "#2d2d2d",
                "&:hover": { backgroundColor: "#555555" },
              }}
            >
              Save Address
            </Button>
          </Box>
        </ModalBox>
      </Modal>

      <ConfirmationDialog
        open={dialogOpen}
        title="Confirm Update"
        content="Are you sure you want to save this address?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Confirm Delete"
        content="Are you sure you want to delete this address? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default ShippingInfoPopup;
