import { Box } from "@mui/material";
import React, {
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/system";
import { UserContext } from "../../utils/userContext";
import * as Yup from "yup";

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

// Validation schema
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  address: Yup.string().required("Address is required"),
  label: Yup.string().required("Label is required"),
  apartment: Yup.string().required("Apartment is required"),
  floor: Yup.string().required("Floor is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  zipCode: Yup.string().required("Zip code is required"),
});

const ShippingForm = forwardRef(({ shippingData, onChange }, ref) => {
  const [selectedOption, setSelectedOption] = useState("new");
  const { userSession } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Expose the validateForm method to parent components
  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      try {
        await validationSchema.validate(shippingData, { abortEarly: false });
        setErrors({});
        return true;
      } catch (validationErrors) {
        const formattedErrors = {};
        validationErrors.inner.forEach((error) => {
          formattedErrors[error.path] = error.message;
        });
        setErrors(formattedErrors);

        // Mark all fields as touched to show errors
        const allTouched = Object.keys(shippingData).reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {});
        setTouched(allTouched);

        return false;
      }
    },
  }));

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
          const newData = {
            firstName: userSession.firstName || "",
            lastName: userSession.lastName || "",
            address: defaultAddress.address1 || "",
            label: "Home", // Optional
            apartment: defaultAddress.address2 || "",
            floor: "1", // Optional
            country: defaultAddress.country || "",
            city: defaultAddress.city || "",
            zipCode: defaultAddress.postalCode || "",
          };

          onChange(newData);

          // Clear errors and touched state when using existing address
          setErrors({});
          setTouched({});
        }
      } else {
        console.log("No shipment addresses found!");
      }
    }

    if (option === "new") {
      console.log("Switching to empty new address.");
      const emptyData = {
        firstName: "",
        lastName: "",
        address: "",
        label: "",
        apartment: "",
        floor: "",
        country: "",
        city: "",
        zipCode: "",
      };

      onChange(emptyData);

      // Clear errors and touched state when switching to new address
      setErrors({});
      setTouched({});
    }
  };

  const validateField = (name, value) => {
    try {
      // Validate just this field
      Yup.reach(validationSchema, name).validateSync(value);
      // Clear the error if validation passes
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      // Set the error message if validation fails
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(shippingData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...shippingData, [name]: value };
    onChange(updatedData);

    // Mark field as touched
    setTouched({ ...touched, [name]: true });

    // Validate the field if it's been touched
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, shippingData[name]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(shippingData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate the entire form
    const isValid = await validateForm();

    if (isValid) {
      console.log("Shipping Data:", shippingData);
      onChange(shippingData);
    } else {
      console.log("Form validation failed:", errors);
    }
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
                  onBlur={handleBlur}
                  required
                />
                {touched.firstName && errors.firstName && (
                  <div className="error-message">{errors.firstName}</div>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={shippingData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.lastName && errors.lastName && (
                  <div className="error-message">{errors.lastName}</div>
                )}
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
                  onBlur={handleBlur}
                  required
                />
                {touched.address && errors.address && (
                  <div className="error-message">{errors.address}</div>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="label"
                  name="label"
                  placeholder="Label"
                  value={shippingData.label}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.label && errors.label && (
                  <div className="error-message">{errors.label}</div>
                )}
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
                  onBlur={handleBlur}
                  required
                />
                {touched.apartment && errors.apartment && (
                  <div className="error-message">{errors.apartment}</div>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="floor"
                  name="floor"
                  placeholder="Floor"
                  value={shippingData.floor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.floor && errors.floor && (
                  <div className="error-message">{errors.floor}</div>
                )}
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
                  onBlur={handleBlur}
                  required
                />
                {touched.country && errors.country && (
                  <div className="error-message">{errors.country}</div>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={shippingData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.city && errors.city && (
                  <div className="error-message">{errors.city}</div>
                )}
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
                  onBlur={handleBlur}
                  required
                />
                {touched.zipCode && errors.zipCode && (
                  <div className="error-message">{errors.zipCode}</div>
                )}
              </div>
            </div>

            <button type="submit" style={{ display: "none" }}></button>
          </form>
        </Box>
      </Box>
    </Box>
  );
});

export default ShippingForm;
