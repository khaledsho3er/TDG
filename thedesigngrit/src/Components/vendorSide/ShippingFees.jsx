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
} from "@mui/material";
import { City } from "country-state-city";
import { useVendor } from "../../utils/vendorContext";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const ShippingFees = () => {
  const { vendor } = useVendor();
  const [cities, setCities] = useState([]);
  const [shippingFees, setShippingFees] = useState({}); // { city: fee }
  const [selectedCity, setSelectedCity] = useState(null);
  const [feeInput, setFeeInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all Egyptian cities
  useEffect(() => {
    const egyptCities = City.getCitiesOfCountry("EG");
    setCities(egyptCities);
  }, []);

  // Fetch existing shipping fees for the brand
  useEffect(() => {
    const fetchFees = async () => {
      if (!vendor?.brandId) return;
      setLoading(true);
      try {
        const res = await axios.get("/api/brand/shipping-fee", {
          params: { brandId: vendor.brandId },
          withCredentials: true,
        });
        // Convert array to { city: fee }
        const feesObj = {};
        if (Array.isArray(res.data)) {
          res.data.forEach((item) => {
            feesObj[item.city] = item.fee;
          });
        }
        setShippingFees(feesObj);
      } catch (err) {
        setShippingFees({});
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [vendor]);

  // Open modal to edit/add fee for a city
  const handleEditFee = (city) => {
    setSelectedCity(city);
    setFeeInput(shippingFees[city.name] || "");
    setModalOpen(true);
  };

  // Save fee to backend
  const handleSaveFee = async () => {
    if (!selectedCity || !vendor?.brandId) return;
    setLoading(true);
    try {
      await axios.post(
        "/api/brand/shipping-fee",
        {
          city: selectedCity.name,
          fee: feeInput,
          brandId: vendor.brandId,
        },
        { withCredentials: true }
      );
      setShippingFees((prev) => ({ ...prev, [selectedCity.name]: feeInput }));
      setModalOpen(false);
    } catch (err) {
      alert("Failed to save shipping fee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Shipping Fees Per City
      </Typography>
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
            {cities.map((city) => (
              <TableRow key={city.id}>
                <TableCell>{city.name}</TableCell>
                <TableCell>{shippingFees[city.name] || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditFee(city)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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
            Set Shipping Fee for {selectedCity?.name}
          </Typography>
          <TextField
            label="Shipping Fee (EGP)"
            type="number"
            value={feeInput}
            onChange={(e) => setFeeInput(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={() => setModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveFee}
              disabled={loading || !feeInput}
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
