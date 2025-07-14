import { Box } from "@mui/material";
import React, { useState, useContext } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/system";
import BillSummary from "./billingSummary";
import { useCart } from "../../Context/cartcontext";
import { UserContext } from "../../utils/userContext"; // adjust path accordingly
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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

function BillingForm({
  billingData,
  onChange,
  billData,
  errors = {},
  validateOnChange = false,
  shippingData, // Add shippingData as a prop
}) {
  const [selectedOption, setSelectedOption] = useState("new");
  const { userSession } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...billingData, [name]: value };
    onChange(updatedData);
  };

  // Add CSS for error styling
  const errorStyle = {
    border: "1px solid red",
    backgroundColor: "rgba(255, 0, 0, 0.05)",
  };

  const errorMessageStyle = {
    color: "red",
    fontSize: "12px",
    marginTop: "4px",
    textAlign: "left",
  };

  const handleCheckboxChange = (option) => {
    setSelectedOption(option);

    if (option === "existing" && shippingData) {
      // Use the shipping data that was passed from the parent component
      const filledData = {
        firstName: userSession.firstName || shippingData.firstName || "",
        lastName: userSession.lastName || shippingData.lastName || "",
        email: userSession.email || "",
        address: shippingData.address || "",
        country: shippingData.country || "",
        city: shippingData.city || "",
        zipCode: shippingData.zipCode || "",
        countryCode: userSession.countryCode || "+20", // Default or from user data
        phoneNumber: userSession.phoneNumber || "",
      };
      onChange(filledData);
    } else if (option === "new") {
      // If the user chooses to enter new data, clear the form
      onChange({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        countryCode: "+20", // default
        phoneNumber: "",
        country: "",
        city: "",
        zipCode: "",
      });
    }
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

      <Box className="billinginfo-form-container">
        <Box className="Billinginfo-form" sx={{ width: "100%" }}>
          <form
            onSubmit={handleSubmit}
            className="form-container"
            style={{ gap: "1.5rem" }}
          >
            <div
              className="form-row"
              style={{ marginBottom: "0rem", gap: "1rem" }}
            >
              <div className="input-group">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name *"
                  value={billingData.firstName}
                  onChange={handleChange}
                  required
                  style={errors.firstName ? errorStyle : {}}
                />
                {errors.firstName && (
                  <div style={errorMessageStyle}>{errors.firstName}</div>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name *"
                  value={billingData.lastName}
                  onChange={handleChange}
                  required
                  style={errors.lastName ? errorStyle : {}}
                />
                {errors.lastName && (
                  <div style={errorMessageStyle}>{errors.lastName}</div>
                )}
              </div>
            </div>

            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email *"
                value={billingData.email}
                onChange={handleChange}
                required
                style={errors.email ? errorStyle : {}}
              />
              {errors.email && (
                <div style={errorMessageStyle}>{errors.email}</div>
              )}
            </div>

            <div className="input-group">
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Address *"
                value={billingData.address}
                onChange={handleChange}
                required
                style={errors.address ? errorStyle : {}}
              />
              {errors.address && (
                <div style={errorMessageStyle}>{errors.address}</div>
              )}
            </div>

            <div className="input-group">
              <PhoneInput
                placeholder="Phone Number *"
                country={billingData.userCountryCode || "eg"}
                value={billingData.phoneNumber}
                onChange={(phone, countryData) => {
                  onChange({
                    ...billingData,
                    phoneNumber: phone,
                    userCountryCode: countryData.countryCode,
                  });
                }}
                inputStyle={{
                  ...(errors.phoneNumber ? errorStyle : {}),
                  border: errors.phoneNumber
                    ? "1px solid red"
                    : "1px solid #000",
                  borderRadius: "8px",
                  fontSize: "14px",
                  width: "100%",
                }}
                containerStyle={{ marginBottom: "0rem", width: "100%" }}
                buttonStyle={{
                  border: "none",
                }}
              />
              {errors.phoneNumber && (
                <div style={errorMessageStyle}>{errors.phoneNumber}</div>
              )}
            </div>

            <div
              className="form-row"
              style={{ marginBottom: "0rem", gap: "1rem" }}
            >
              <div className="input-group">
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Country *"
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
                  placeholder="City *"
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
                placeholder="Zip Code *"
                value={billingData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" style={{ display: "none" }}></button>
          </form>
        </Box>
        <BillSummary cartItems={cartItems} shippingFee={billData.shippingFee} />
      </Box>
    </Box>
  );
}

export default BillingForm;
