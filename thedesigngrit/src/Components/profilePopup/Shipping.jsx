import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import countryList from "react-select-country-list";
import ConfirmationDialog from "../confirmationMsg"; // Make sure to import your ConfirmationDialog component
import UpdateSentPopup from "../successMsgs/successUpdate";
import { useNavigate } from "react-router-dom";

const ShippingInfoPopup = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
  const [formData, setFormData] = useState({

    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [countries] = useState(countryList().getData());

  useEffect(() => {
    // Fetch user data
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getUser", {
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response || error);
        alert("Failed to fetch user data.");
      }
    };

  const [dialogOpen, setDialogOpen] = useState(false); // Manage dialog state

    fetchData();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setUserData((prev) => ({
      ...prev,
      country: selectedOption.label,
    }));
  };


  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/updateUser",
        userData,
        { withCredentials: true }
      );
      alert("Profile updated successfully!");
      setDialogOpen(true);
      setIsPopupVisible(true); // Show popup on successful registration
      console.log("Shipping Info Submitted:", formData);
    } catch (error) {
      console.error("Error updating user data:", error.response || error);
      alert("Failed to update user data.");
    }
  };
  const closePopup = () => {
    setIsPopupVisible(false); // Close the popup
    navigate("/"); // Navigate to login page after closing popup

  const handleSubmit = (e) => {
    e.preventDefault();
    // Open the confirmation dialog before submitting
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    console.log("Shipping Info Submitted:", formData);
    // Add logic to send form data to the backend or save it
    setDialogOpen(false); // Close the confirmation dialog

  };

  const handleDialogCancel = () => setDialogOpen(false);

  return (
    <div className="shipping-info-content">
      <form className="shipping-form">
        <div className="form-field">
          <label>Address 1</label>
          <input
            type="text"
            name="address1"
            value={userData.address1}
            onChange={handleInputChange}
            placeholder="Enter your primary address"
            required
          />
        </div>
        <div className="form-field">
          <label>Address 2 (Optional)</label>
          <input
            type="text"
            name="address2"
            value={userData.address2}
            onChange={handleInputChange}
            placeholder="Enter additional address"
          />
        </div>
        <div className="shipping-form-field-row">
          <div className="Shipping-city">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={userData.city}
              onChange={handleInputChange}
              placeholder="city"
              required
            />
          </div>

          <div className="Shipping-form-field-postal">
            <label>Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={userData.postalCode}
              onChange={handleInputChange}
              placeholder="Postal code"
              required
            />
          </div>
        </div>
        <div className="form-field">
          <label>Country</label>
          <Select
            options={countries}
            onChange={handleCountryChange}
            placeholder="Select your country"
            isSearchable
            menuPlacement="top"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "white",
                borderRadius: "8px",
                border: state.isFocused
                  ? "2px solid #6b7b58"
                  : "1px solid #ccc",
                boxShadow: state.isFocused
                  ? "0 0 5px rgba(107, 123, 88, 0.5)"
                  : "none",
                padding: "5px",
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
                width: "340px",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#aaa",
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "white",
                borderRadius: "15px",
                border: "1px solid #ccc",
                zIndex: 100,
              }),
              menuList: (base) => ({
                ...base,
                padding: 0,
                maxHeight: "150px", // Limit height of dropdown menu
                overflowY: "auto", // Add scroll if options overflow
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#6b7b58" : "white",
                color: state.isFocused ? "white" : "#2d2d2d",
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
                cursor: "pointer",
                padding: "10px 15px",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#2d2d2d",
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
              }),
            }}
          />
        </div>
        <div className="form-buttons">
          {/*<button type="submit" className="submit-btn" onClick={handleUpdate} Save*/}
          <button type="submit" className="submit-btn">
            Update
          </button>
          <button className="addAddress-btn">Add Address</button>
        </div>
      </form>
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title="Confirm Update"
        content="Are you sure you want to update your shipping information?"
        onConfirm={handleConfirm}
        onCancel={handleDialogCancel}
      />
    </div>
  );
};

export default ShippingInfoPopup;
