import { Box } from "@mui/material";
import React, {
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/system";
import BillSummary from "./billingSummary";
import { useCart } from "../../Context/cartcontext";
import { UserContext } from "../../utils/userContext";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  zipCode: Yup.string().required("Zip code is required"),
});

const BillingForm = forwardRef(
  ({ billingData, onChange, billData, attemptedSubmit }, ref) => {
    const [selectedOption, setSelectedOption] = useState("new");
    const { userSession } = useContext(UserContext);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Update touched state when attemptedSubmit changes
    useEffect(() => {
      if (attemptedSubmit) {
        // Mark all fields as touched when form submission is attempted
        const allTouched = Object.keys(billingData).reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {});
        setTouched(allTouched);

        // Validate all fields
        validateForm();
      }
    }, [attemptedSubmit]);

    // Expose the validateForm method to parent components
    useImperativeHandle(ref, () => ({
      validateForm: async () => {
        try {
          await validationSchema.validate(billingData, { abortEarly: false });
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
      },
    }));

    const handleChange = (e) => {
      const { name, value } = e.target;
      const updatedData = { ...billingData, [name]: value };
      onChange(updatedData);

      // Only validate if the field has been touched before
      if (touched[name]) {
        validateField(name, value);
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
        await validationSchema.validate(billingData, { abortEarly: false });
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

    const handleCheckboxChange = (option) => {
      setSelectedOption(option);

      if (option === "existing" && userSession) {
        const defaultAddress =
          userSession.shipmentAddress?.find((addr) => addr.isDefault) ||
          userSession.shipmentAddress?.[0]; // fallback to the first one
        const userCountryCode = defaultAddress?.country?.toLowerCase() || "eg"; // fallback to Egypt

        if (defaultAddress) {
          const filledData = {
            firstName: userSession.firstName || "",
            lastName: userSession.lastName || "",
            email: userSession.email || "",
            address: defaultAddress.address1 || "",
            country: defaultAddress.country || "",
            city: defaultAddress.city || "",
            zipCode: defaultAddress.postalCode || "",
            countryCode: userCountryCode || "+20", // or default based on country
            phoneNumber: userSession.phoneNumber || "",
          };
          onChange(filledData);
          setErrors({});
          setTouched({});
        }
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
        setErrors({});
        setTouched({});
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(billingData).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Validate the entire form
      const isValid = await validateForm();

      if (isValid) {
        console.log("Billing Data:", billingData);
        onChange(billingData);
      } else {
        console.log("Form validation failed:", errors);
      }
    };

    const handleBlur = (e) => {
      const { name, value } = e.target;
      // Mark field as touched when it loses focus
      setTouched({ ...touched, [name]: true });
      // Validate the field when it loses focus
      validateField(name, value);
    };

    const { cartItems } = useCart(); // Get cart items from context

    // Update the input field styling to only show red border when touched and has error
    const getInputClassName = (fieldName) => {
      return touched[fieldName] && errors[fieldName]
        ? "input-field error"
        : "input-field";
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
                    onBlur={handleBlur}
                    className={getInputClassName("firstName")}
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
                    value={billingData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName("lastName")}
                    required
                  />
                  {touched.lastName && errors.lastName && (
                    <div className="error-message">{errors.lastName}</div>
                  )}
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
                  onBlur={handleBlur}
                  className={getInputClassName("email")}
                  required
                />
                {touched.email && errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={billingData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("address")}
                  required
                />
                {touched.address && errors.address && (
                  <div className="error-message">{errors.address}</div>
                )}
              </div>

              <div className="input-group">
                <PhoneInput
                  country={billingData.userCountryCode || "eg"}
                  value={billingData.phoneNumber}
                  onChange={(phone, countryData) => {
                    const updatedData = {
                      ...billingData,
                      phoneNumber: phone,
                      userCountryCode: countryData.countryCode,
                    };
                    onChange(updatedData);

                    // Only validate if the field has been touched before
                    if (touched.phoneNumber) {
                      validateField("phoneNumber", phone);
                    }
                  }}
                  inputStyle={{
                    border: "1px solid #000",
                    borderRadius: "8px",
                    fontSize: "14px",
                    width: "100%",
                  }}
                  containerStyle={{ marginBottom: "1rem", width: "100%" }}
                  buttonStyle={{
                    border: "none",
                  }}
                  onBlur={() => {
                    // Mark field as touched when it loses focus
                    setTouched({ ...touched, phoneNumber: true });
                    validateField("phoneNumber", billingData.phoneNumber);
                  }}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <div className="error-message">{errors.phoneNumber}</div>
                )}
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
                    onBlur={handleBlur}
                    className={getInputClassName("country")}
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
                    value={billingData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName("city")}
                    required
                  />
                  {touched.city && errors.city && (
                    <div className="error-message">{errors.city}</div>
                  )}
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
                  onBlur={handleBlur}
                  className={getInputClassName("zipCode")}
                  required
                />
                {touched.zipCode && errors.zipCode && (
                  <div className="error-message">{errors.zipCode}</div>
                )}
              </div>
              <button type="submit" style={{ display: "none" }}></button>
            </form>
          </Box>
          <BillSummary cartItems={cartItems} />
        </Box>
      </Box>
    );
  }
);

export default BillingForm;
