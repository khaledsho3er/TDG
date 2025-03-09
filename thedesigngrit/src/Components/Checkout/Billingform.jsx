import { Box } from "@mui/material";
import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/system";
import BillSummary from "./billingSummary";
import { useCart } from "../../Context/cartcontext";

// Styled circular checkbox
const CircularCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: 0,
  marginLeft: "12px",
  marginRight: "12px",
  "& .MuiSvgIcon-root": {
    fontSize: "0", // Hide the default square checkmark
  },
  width: 20,
  height: 20,
  borderRadius: "50%",
  border: "2px solid #000",
  backgroundColor: "transparent",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "transparent",
    transition: "background-color 0.2s ease-in-out",
  },
  "&.Mui-checked:before": {
    backgroundColor: "#000", // Change this to your desired color
  },
}));

function BillingForm({ billingData, onChange, billData }) {
  const [selectedOption, setSelectedOption] = useState("new");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...billingData, [name]: value };
    onChange(updatedData);
  };

  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Billing Data:", billingData);
    onChange(billingData);
  };

  const { cartItems } = useCart(); // Get cart items from context

  return (
    <Box className="Billinginfo_container">
      <Box className="Billinginfo_checkbox">
        <FormControlLabel
          control={
            <CircularCheckbox
              checked={selectedOption === "existing"}
              onChange={() => handleCheckboxChange("existing")}
            />
          }
          label="Use the existing shipping Information"
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "16px",
            paddingLeft: "20px",
            "& .MuiFormControlLabel-label": {
              fontFamily: "Montserrat, sans-serif",
              fontSize: "13px",
              color: "#333",
            },
          }}
        />

        {/* Divider line */}
        <Box
          sx={{
            width: "100%",
            height: "1px",
            backgroundColor: "#ccc",
            margin: "8px 0",
          }}
        />

        <FormControlLabel
          control={
            <CircularCheckbox
              checked={selectedOption === "new"}
              onChange={() => handleCheckboxChange("new")}
            />
          }
          label="Enter a new Billing Information"
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "16px",
            paddingLeft: "20px",
            "& .MuiFormControlLabel-label": {
              fontFamily: "Montserrat, sans-serif",
              fontSize: "13px",
              color: "#333",
            },
          }}
        />
      </Box>

      {selectedOption === "new" && (
        <Box className="billinginfo-form-container">
          <Box className="Billinginfo-form">
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-row">
                <div className="input-group">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={billingData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={billingData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={billingData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={billingData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <div className="phone-number-group">
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={billingData.countryCode}
                    onChange={handleChange}
                    required
                  >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+91">+91</option>
                    {/* Add more country codes */}
                  </select>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={billingData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="Country"
                    value={billingData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="City"
                    value={billingData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group half-width">
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={billingData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" style={{ display: "none" }}></button>
            </form>
          </Box>
          <BillSummary cartItems={cartItems} />
        </Box>
      )}
    </Box>
  );
}

export default BillingForm;
