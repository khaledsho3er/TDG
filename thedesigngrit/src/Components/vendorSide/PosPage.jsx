import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";

const PosPage = () => {
  const [purchaseCode, setPurchaseCode] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [manualItem, setManualItem] = useState({
    title: "",
    price: "",
    productId: "",
  });

  const handleSearch = () => {
    // Fetch customer data by purchase code logic here
    setCustomerData({
      name: "John Doe",
      orderDetails: [{ title: "Sample Product", price: 100 }],
    });
  };

  const handleAddManualItem = () => {
    // Add manual item logic here
    console.log("Manual Item Added", manualItem);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        POS System
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Search Customer</Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Purchase Code"
              variant="outlined"
              value={purchaseCode}
              onChange={(e) => setPurchaseCode(e.target.value)}
            />
            <Button variant="contained" onClick={handleSearch}>
              Load
            </Button>
          </Box>
        </CardContent>
      </Card>

      {customerData && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6">Customer Profile</Typography>
            <Typography>Name: {customerData.name}</Typography>
            <Typography>Orders:</Typography>
            <ul>
              {customerData.orderDetails.map((item, idx) => (
                <li key={idx}>
                  {item.title} - ${item.price}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
        <Tab label="Add From Store" />
        <Tab label="Add Manually" />
      </Tabs>

      {tabIndex === 1 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Add Manual Item</Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                label="Product Title"
                value={manualItem.title}
                onChange={(e) =>
                  setManualItem({ ...manualItem, title: e.target.value })
                }
              />
              <TextField
                label="Price"
                type="number"
                value={manualItem.price}
                onChange={(e) =>
                  setManualItem({ ...manualItem, price: e.target.value })
                }
              />
              <TextField
                label="Product ID"
                value={manualItem.productId}
                onChange={(e) =>
                  setManualItem({ ...manualItem, productId: e.target.value })
                }
              />
              <Button variant="contained" onClick={handleAddManualItem}>
                Add Item
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PosPage;
