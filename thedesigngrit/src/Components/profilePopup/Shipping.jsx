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
      await axios.put(
        `https://tdg-db.onrender.com/api/updateUser/${userSession.id}`,
        userData,
        {
          withCredentials: true,
        }
      );
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
        <div className="profile-info-first">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div className="profile-form-field">
              <p>Address 1:</p>
              <p>{userData.address1 || "Not provided"}</p>
            </div>
            <div className="profile-form-field">
              <p>Address 2:</p>
              <p>{userData.address2 || "Not provided"}</p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div className="profile-form-field">
              <p>City:</p>
              <p>{userData.city || "Not provided"}</p>
            </div>
            <div className="profile-form-field">
              <p>Country:</p>
              <p>{userData.country || "Not provided"}</p>
            </div>
          </div>
          <div className="profile-form-field">
            <p>Postal Code:</p>
            <p> {userData.postalCode || "Not provided"}</p>
          </div>
          <div>
            <button
              style={{
                cursor: "pointer",
                backgroundColor: "transparent",
                color: "#2d2d2d",
                textDecoration: "underline",
                marginLeft: "auto",
                display: "block",
              }}
              onClick={() => setIsEditing(true)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
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
