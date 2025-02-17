// import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
// import axios from "axios";
// import countryList from "react-select-country-list";
// import ConfirmationDialog from "../confirmationMsg";
// import { UserContext } from "../../utils/userContext";

// const ShippingInfoPopup = () => {
//   const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
//   const [userData, setUserData] = useState({
//     address1: "",
//     address2: "",
//     city: "",
//     postalCode: "",
//     country: "",
//   });
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const { userSession } = useContext(UserContext);
//   const [countries] = useState(countryList().getData());

//   useEffect(() => {
//     // Fetch user data
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `https://tdg-db.onrender.com/api/getUserById/${userSession.id}`,
//           { withCredentials: true }
//         );
//         setUserData(response.data);
//       } catch (error) {
//         console.error("Error fetching user data:", error.response || error);
//         alert("Failed to fetch user data.");
//       }
//     };

//     fetchData();
//   }, [userSession.id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleCountryChange = (selectedOption) => {
//     setUserData((prev) => ({
//       ...prev,
//       country: selectedOption.label,
//     }));
//   };

//   const handleUpdate = () => {
//     setDialogOpen(true);
//   };

//   const handleConfirm = async () => {
//     try {
//       await axios.put(
//         `https://tdg-db.onrender.com/api/updateUser/${userSession.id}`,
//         userData,
//         {
//           withCredentials: true,
//         }
//       );
//       alert("Profile updated successfully!");
//       setIsEditing(false); // Exit edit mode after update
//     } catch (error) {
//       console.error("Error updating user data:", error.response || error);
//       alert("Failed to update user data.");
//     }
//     setDialogOpen(false);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//   };

//   return (
//     <div
//       className="profile-info"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         marginTop: "20px",
//         boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
//         padding: "20px",
//         borderRadius: "10px",
//         backgroundColor: "#fff",
//       }}
//     >
//       <h2>Shipping Information</h2>

//       {/* View Mode */}
//       {!isEditing ? (
//         <div className="profile-info-first">
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "space-between",
//             }}
//           >
//             <div className="profile-form-field">
//               <p>Address 1:</p>
//               <p>{userData.address1 || "Not provided"}</p>
//             </div>
//             <div className="profile-form-field">
//               <p>Address 2:</p>
//               <p>{userData.address2 || "Not provided"}</p>
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//             }}
//           >
//             <div className="profile-form-field">
//               <p>City:</p>
//               <p>{userData.city || "Not provided"}</p>
//             </div>
//             <div className="profile-form-field">
//               <p>Country:</p>
//               <p>{userData.country || "Not provided"}</p>
//             </div>
//           </div>
//           <div className="profile-form-field">
//             <p>Postal Code:</p>
//             <p> {userData.postalCode || "Not provided"}</p>
//           </div>
//           <div>
//             <button
//               style={{
//                 cursor: "pointer",
//                 backgroundColor: "transparent",
//                 color: "#2d2d2d",
//                 textDecoration: "underline",
//                 marginLeft: "auto",
//                 display: "block",
//               }}
//               onClick={() => setIsEditing(true)}
//             >
//               {isEditing ? "Cancel" : "Edit"}
//             </button>
//           </div>
//         </div>
//       ) : (
//         // Edit Mode
//         <form className="shipping-form">
//           <div className="shipping-form-field">
//             <label>Address 1</label>
//             <input
//               type="text"
//               name="address1"
//               value={userData.address1}
//               onChange={handleInputChange}
//               placeholder="Enter your primary address"
//               required
//             />
//           </div>
//           <div className="shipping-form-field">
//             <label>Address 2 (Optional)</label>
//             <input
//               type="text"
//               name="address2"
//               value={userData.address2}
//               onChange={handleInputChange}
//               placeholder="Enter additional address"
//             />
//           </div>
//           <div className="shipping-form-field-row">
//             <div className="Shipping-city">
//               <label>City</label>
//               <input
//                 type="text"
//                 name="city"
//                 value={userData.city}
//                 onChange={handleInputChange}
//                 placeholder="City"
//                 required
//               />
//             </div>

//             <div className="Shipping-form-field-postal">
//               <label>Postal Code</label>
//               <input
//                 type="text"
//                 name="postalCode"
//                 value={userData.postalCode}
//                 onChange={handleInputChange}
//                 placeholder="Postal code"
//                 required
//               />
//             </div>
//           </div>
//           <div className="form-field">
//             <label>Country</label>
//             <Select
//               options={countries}
//               onChange={handleCountryChange}
//               placeholder="Select your country"
//               isSearchable
//               menuPlacement="top"
//               value={
//                 countries.find((c) => c.label === userData.country) || null
//               }
//             />
//           </div>
//           <div className="form-buttons">
//             <button type="button" className="submit-btn" onClick={handleUpdate}>
//               Update
//             </button>
//             <button type="button" className="cancel-btn" onClick={handleCancel}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Confirmation Dialog */}
//       <ConfirmationDialog
//         open={dialogOpen}
//         title="Confirm Update"
//         content="Are you sure you want to update your shipping information?"
//         onConfirm={handleConfirm}
//         onCancel={() => setDialogOpen(false)}
//       />
//     </div>
//   );
// };

// export default ShippingInfoPopup;
import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import countryList from "react-select-country-list";
import ConfirmationDialog from "../confirmationMsg";
import { UserContext } from "../../utils/userContext";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const ShippingInfoPopup = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ shipmentAddress: [] });
  const [newAddress, setNewAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const { userSession } = useContext(UserContext);
  const [countries] = useState(countryList().getData());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://tdg-db.onrender.com/api/getUserById/${userSession.id}`,
          { withCredentials: true }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, [userSession.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setNewAddress((prev) => ({
      ...prev,
      country: selectedOption.label,
    }));
  };

  const handleEditAddress = (index) => {
    setSelectedAddressIndex(index);
    setNewAddress(userData.shipmentAddress[index]);
    setIsEditing(true);
  };
  const handleDefaultChange = (index) => {
    setUserData((prev) => {
      const updatedAddresses = prev.shipmentAddress.map((addr, i) => ({
        ...addr,
        isDefault: i === index, // Only the selected address is default
      }));

      return { ...prev, shipmentAddress: updatedAddresses };
    });
  };

  const handleAddNewAddress = () => {
    setNewAddress({
      address1: "",
      address2: "",
      city: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });
    setSelectedAddressIndex(null);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      let updatedAddresses = [...userData.shipmentAddress];
      if (selectedAddressIndex !== null) {
        updatedAddresses[selectedAddressIndex] = newAddress;
      } else {
        updatedAddresses.push(newAddress);
      }

      await axios.put(
        `https://tdg-db.onrender.com/api/updateUser/${userSession.id}`,
        { shipmentAddress: updatedAddresses },
        { withCredentials: true }
      );

      setUserData((prev) => ({
        ...prev,
        shipmentAddress: updatedAddresses,
      }));

      alert("Address updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update address.");
    }
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDialogOpen(false);
  };

  return (
    <div
      className="profile-info"
      style={{ textAlign: "center", padding: "20px", flexDirection: "column" }}
    >
      <h2>Shipping Addresses</h2>
      {userData.shipmentAddress.map((addr, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "80%",
            textAlign: "left",
            padding: "22px",
            margin: "auto",
            marginBottom: "15px",
          }}
        >
          <label
            style={{
              marginLeft: "auto",
              display: "block",
              padding: "5px",
              border: addr.isDefault ? "1px solid #6c7c59" : "1px solid #ccc",
              backgroundColor: addr.isDefault ? "#6c7c59" : "transparent",
              color: addr.isDefault ? "#fff" : "#2d2d2d",
              borderRadius: "4px",
              textAlign: "center",
              width: "fit-content",
            }}
          >
            {addr.isDefault ? "Default" : "Not Default"}
          </label>
          <div className="profile-form-field" style={{ width: "48%" }}>
            <label>Address 1:</label>
            <p>{addr.address1}</p>
          </div>
          <div className="profile-form-field" style={{ width: "48%" }}>
            <label>Address 2:</label>
            <p>{addr.address2 || "N/A"}</p>
          </div>{" "}
          <div className="profile-form-field" style={{ width: "48%" }}>
            <label>City:</label>

            <p>{addr.city}</p>
          </div>
          <div className="profile-form-field" style={{ width: "48%" }}>
            <label>Postal Code:</label>
            <p>{addr.postalCode}</p>
          </div>
          <div className="profile-form-field" style={{ width: "48%" }}>
            <label>Country:</label>
            <p>{addr.country}</p>
          </div>
          <button
            style={{ marginLeft: "auto", display: "block" }}
            className="submit-btn"
            onClick={() => handleEditAddress(index)}
          >
            Edit
          </button>
        </div>
      ))}
      <button
        className="submit-btn"
        sx={{ margin: "auto" }}
        onClick={handleAddNewAddress}
      >
        Add New Address
      </button>

      <Modal open={isEditing} onClose={handleCancel}>
        <Box
          sx={{
            width: 400,
            padding: 4,
            margin: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
            marginTop: "10%",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Typography variant="h6" align="center" fontFamily={"Horizon"}>
            {selectedAddressIndex !== null ? "Edit Address" : "New Address"}
          </Typography>
          <TextField
            fullWidth
            label="Address 1"
            name="address1"
            value={newAddress.address1}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address 2"
            name="address2"
            value={newAddress.address2}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="City"
            name="city"
            value={newAddress.city}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={newAddress.postalCode}
            onChange={handleInputChange}
            margin="normal"
          />
          <Select
            options={countries}
            onChange={handleCountryChange}
            placeholder="Select your country"
            isSearchable
            value={
              countries.find((c) => c.label === newAddress.country) || null
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAddress.isDefault}
                onChange={(e) => {
                  setNewAddress((prev) => ({
                    ...prev,
                    isDefault: e.target.checked,
                  }));

                  if (e.target.checked) {
                    setUserData((prev) => {
                      const updatedAddresses = prev.shipmentAddress.map(
                        (addr) => ({
                          ...addr,
                          isDefault: false, // Reset all other addresses
                        })
                      );
                      return { ...prev, shipmentAddress: updatedAddresses };
                    });
                  }
                }}
              />
            }
            label="Set as Default"
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <button
              sx={{ width: "40%" }}
              className="submit-btn"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              sx={{ width: "40%" }}
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </Box>
        </Box>
      </Modal>
      <div style={{ position: "relative", zIndex: 9999 }}>
        <ConfirmationDialog
          open={dialogOpen}
          title="Confirm Update"
          content="Are you sure you want to update your shipping information?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ShippingInfoPopup;
