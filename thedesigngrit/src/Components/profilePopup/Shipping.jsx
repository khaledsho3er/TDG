import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import countryList from "react-select-country-list";
import ConfirmationDialog from "../confirmationMsg";
import { UserContext } from "../../utils/userContext";

const ShippingInfoPopup = () => {
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [userData, setUserData] = useState({
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { userSession } = useContext(UserContext);
  const [countries] = useState(countryList().getData());

  useEffect(() => {
    // Fetch user data
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://tdg-db.onrender.com/api/getUserById/${userSession.id}`,
          { withCredentials: true }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response || error);
        alert("Failed to fetch user data.");
      }
    };

    fetchData();
  }, [userSession.id]);

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

  const handleUpdate = () => {
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await axios.put("https://tdg-db.onrender.com/api/updateUser", userData, {
        withCredentials: true,
      });
      alert("Profile updated successfully!");
      setIsEditing(false); // Exit edit mode after update
    } catch (error) {
      console.error("Error updating user data:", error.response || error);
      alert("Failed to update user data.");
    }
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div
      className="profile-info"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
      }}
    >
      <h2>Shipping Information</h2>

      {/* View Mode */}
      {!isEditing ? (
        <div className="shipping-info">
          <p>
            <strong>Address 1:</strong> {userData.address1 || "Not provided"}
          </p>
          <p>
            <strong>Address 2:</strong> {userData.address2 || "Not provided"}
          </p>
          <p>
            <strong>City:</strong> {userData.city || "Not provided"}
          </p>
          <p>
            <strong>Postal Code:</strong>{" "}
            {userData.postalCode || "Not provided"}
          </p>
          <p>
            <strong>Country:</strong> {userData.country || "Not provided"}
          </p>
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            Edit
          </button>
        </div>
      ) : (
        // Edit Mode
        <form className="shipping-form">
          <div className="shipping-form-field">
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
          <div className="shipping-form-field">
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
                placeholder="City"
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
              value={
                countries.find((c) => c.label === userData.country) || null
              }
            />
          </div>
          <div className="form-buttons">
            <button type="button" className="submit-btn" onClick={handleUpdate}>
              Update
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title="Confirm Update"
        content="Are you sure you want to update your shipping information?"
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default ShippingInfoPopup;
