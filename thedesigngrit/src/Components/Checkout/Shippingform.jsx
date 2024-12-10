import { Box } from "@mui/material";
import React, { useState } from "react";
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

function ShippingForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    label: "",
    apartment: "",
    floor: "",
    country: "",
    city: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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
                  value={formData.firstName}
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
                  value={formData.lastName}
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
                  value={formData.address}
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
                  value={formData.label}
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
                  value={formData.apartment}
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
                  value={formData.floor}
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
                  value={formData.country}
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
                  value={formData.city}
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
                  value={formData.zipCode}
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
