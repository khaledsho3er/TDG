import { Box } from "@mui/material";
import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/system";

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

function ShippingForm({ shippingData, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...shippingData, [name]: value };
    onChange(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the parent onChange function to update the shipping data
    console.log("Shipping Data:", shippingData);
    onChange(shippingData);
  };

  return (
    <Box className="Billinginfo_container">
      <Box className="Billinginfo_checkbox">
        <FormControlLabel
          control={<CircularCheckbox />}
          label="Use the existing Billing Information"
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "16px", // Adjust spacing between checkbox and label
            paddingLeft: "20px",
            "& .MuiFormControlLabel-label": {
              fontFamily: "Montserrat, san-sarif", // Change to your desired font
              fontSize: "13px", // Adjust font size
              color: "#333", // Adjust font color
            },
          }}
        />
        <Box
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#ccc",
            margin: "8px 0",
          }}
        />
        <FormControlLabel
          control={<CircularCheckbox />}
          label="Enter a new Billing Information"
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "16px", // Adjust spacing between checkbox and label
            paddingLeft: "20px",
            "& .MuiFormControlLabel-label": {
              fontFamily: "Montserrat, san-sarif", // Change to your desired font
              fontSize: "13px", // Adjust font size
              color: "#333", // Adjust font color
            },
          }}
        />
      </Box>

      <Box className="shipping-form-container">
        <Box className="shipping-form">
          <form onSubmit={handleSubmit} className="shippingform-form-container">
            {/* Row 1 */}
            <div className="shippingform-form-row">
              <div className="input-group">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={shippingData.firstName}
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
                  value={shippingData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="shippingform-form-row">
              <div className="input-group">
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={shippingData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="label"
                  name="label"
                  placeholder="Label"
                  value={shippingData.label}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="shippingform-form-row">
              <div className="input-group">
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  placeholder="Apartment"
                  value={shippingData.apartment}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="floor"
                  name="floor"
                  placeholder="Floor"
                  value={shippingData.floor}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="shippingform-form-row">
              <div className="input-group">
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Country"
                  value={shippingData.country}
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
                  value={shippingData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 5 */}
            <div className="shippingform-form-row-zip">
              <div className="input-group">
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={shippingData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" style={{ display: "none" }}></button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default ShippingForm;
