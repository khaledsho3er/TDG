import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { City } from "country-state-city";
import { useVendor } from "../../utils/vendorContext";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const ShippingFees = () => {
  const { vendor } = useVendor();
  const [cities, setCities] = useState([]); // All Egypt cities
  const [shippingFees, setShippingFees] = useState([]); // Array of { city, fee }
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [feeInput, setFeeInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // null for add, index for edit
  const [loading, setLoading] = useState(false);

  // Fetch all Egyptian cities
  useEffect(() => {
    setCities(City.getCitiesOfCountry("EG"));
  }, []);

  // Fetch existing shipping fees for the brand
  useEffect(() => {
    const fetchFees = async () => {
      if (!vendor?.brandId) return;
      setLoading(true);
      try {
        const res = await axios.get(
          "https://api.thedesigngrit.com/api/brand/shipping-fee",
          {
            params: { brandId: vendor.brandId },
            withCredentials: true,
          }
        );
        setShippingFees(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setShippingFees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [vendor]);

  // Open modal for add or edit
  const handleOpenModal = (editIndex = null) => {
    setEditingIndex(editIndex);
    if (editIndex !== null) {
      // Edit mode
      setSelectedCity(shippingFees[editIndex].city);
      setFeeInput(shippingFees[editIndex].fee);
    } else {
      // Add mode
      setSelectedCity("");
      setFeeInput("");
    }
    setModalOpen(true);
  };

  // Save fee to backend (add or update)
  const handleSaveFee = async () => {
    if (!selectedCity || !feeInput || !vendor?.brandId) return;
    setLoading(true);
    try {
      await axios.post(
        "https://api.thedesigngrit.com/api/brand/shipping-fee",
        {
          city: selectedCity,
          fee: feeInput,
          brandId: vendor.brandId,
        },
        { withCredentials: true }
      );
      // Refetch fees
      const res = await axios.get(
        "https://api.thedesigngrit.com/api/brand/shipping-fee",
        {
          params: { brandId: vendor.brandId },
          withCredentials: true,
        }
      );
      setShippingFees(Array.isArray(res.data) ? res.data : []);
      setModalOpen(false);
    } catch (err) {
      alert("Failed to save shipping fee.");
    } finally {
      setLoading(false);
    }
  };

  // Disable already-used cities in dropdown (except when editing that city)
  const usedCities = shippingFees.map((f) => f.city);

  // Reset dialog state on close
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCity("");
    setFeeInput("");
    setEditingIndex(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Shipping Fees Per City
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => handleOpenModal(null)}
      >
        Add Shipping Fee
      </Button>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell>Shipping Fee (EGP)</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shippingFees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No shipping fees set yet.
                </TableCell>
              </TableRow>
            ) : (
              shippingFees.map((row, idx) => (
                <TableRow key={row.city}>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.fee}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenModal(idx)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 320,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editingIndex !== null ? `Edit Shipping Fee` : `Add Shipping Fee`}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              value={selectedCity}
              label="City"
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={editingIndex !== null} // Don't allow changing city on edit
            >
              {cities.map((city) => (
                <MenuItem
                  key={city.id}
                  value={city.name}
                  disabled={
                    editingIndex === null && usedCities.includes(city.name)
                  }
                >
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Shipping Fee (EGP)"
            type="number"
            value={feeInput}
            onChange={(e) => setFeeInput(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={handleCloseModal} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveFee}
              disabled={loading || !selectedCity || !feeInput}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ShippingFees;
