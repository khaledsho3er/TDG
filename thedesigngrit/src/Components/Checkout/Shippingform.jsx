import { Box } from "@mui/material";
import React, { useState, useContext } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/system";
import { UserContext } from "../../utils/userContext"; // adjust path accordingly

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
  const [selectedOption, setSelectedOption] = useState("new");
  const { userSession } = useContext(UserContext);

  const handleCheckboxChange = (option) => {
    console.log("Checkbox clicked:", option);
    console.log("User data:", userSession);

    setSelectedOption(option);

    if (option === "existing") {
      console.log("Shipment Addresses:", userSession?.shipmentAddress);

      if (userSession?.shipmentAddress?.length > 0) {
        let defaultAddress = userSession.shipmentAddress.find(
          (addr) => addr.isDefault
        );
        console.log("Default Address Found:", defaultAddress);

        if (!defaultAddress) {
          defaultAddress = userSession.shipmentAddress[0];
          console.log("No default, using first address:", defaultAddress);
        }

        if (defaultAddress) {
          onChange({
            firstName: userSession.firstName || "",
            lastName: userSession.lastName || "",
            address: defaultAddress.address1 || "",
            label: "Home", // Optional
            apartment: defaultAddress.address2 || "",
            floor: "1", // Optional
            country: defaultAddress.country || "",
            city: defaultAddress.city || "",
            zipCode: defaultAddress.postalCode || "",
          });
        }
      } else {
        console.log("No shipment addresses found!");
      }
    }

    if (option === "new") {
      console.log("Switching to empty new address.");
      onChange({
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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...shippingData, [name]: value };
    onChange(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Shipping Data:", shippingData);
    onChange(shippingData);
  };

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
          label="Use the existing Shipping Information"
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "16px",
            paddingLeft: "20px",
            "& .MuiFormControlLabel-label": {
              fontFamily: "Montserrat, san-sarif",
              fontSize: "13px",
              color: "#333",
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
          control={
            <CircularCheckbox
              checked={selectedOption === "new"}
              onChange={() => handleCheckboxChange("new")}
            />
          }
          label="Enter a new Shipping Information"
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "16px",
            paddingLeft: "20px",
            "& .MuiFormControlLabel-label": {
              fontFamily: "Montserrat, san-sarif",
              fontSize: "13px",
              color: "#333",
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
            <div className="shippingform-form-row">
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

            <button type="submit" style={{ display: "none" }}></button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default ShippingForm;
