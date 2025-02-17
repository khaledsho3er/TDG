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

const ShippingInfoPopup = () => {
  const { userSession } = useContext(UserContext);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);
  const [countries] = useState(countryList().getData());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://tdg-db.onrender.com/api/getUserById/${userSession.id}`,
          { withCredentials: true }
        );
        setAddresses(response.data.addresses || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchData();
  }, [userSession.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (selectedOption) => {
    setNewAddress((prev) => ({ ...prev, country: selectedOption.label }));
  };

  const handleAddAddress = () => {
    setDialogMessage("Are you sure you want to add this new address?");
    setOnConfirm(() => confirmAddAddress);
    setDialogOpen(true);
  };

  const confirmAddAddress = async () => {
    if (
      !newAddress.address1 ||
      !newAddress.city ||
      !newAddress.postalCode ||
      !newAddress.country
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const updatedAddresses = newAddress.isDefault
      ? addresses.map((addr) => ({ ...addr, isDefault: false }))
      : addresses;

    const newAddressesList = [...updatedAddresses, newAddress];

    try {
      await axios.put(
        `https://tdg-db.onrender.com/api/updateUser/${userSession.id}`,
        { addresses: newAddressesList },
        { withCredentials: true }
      );
      setAddresses(newAddressesList);
      setNewAddress({
        address1: "",
        address2: "",
        city: "",
        postalCode: "",
        country: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleSetDefault = (index) => {
    setDialogMessage(
      "Are you sure you want to set this as your default address?"
    );
    setOnConfirm(() => () => confirmSetDefault(index));
    setDialogOpen(true);
  };

  const confirmSetDefault = async (index) => {
    const updatedAddresses = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));

    try {
      await axios.put(
        `https://tdg-db.onrender.com/api/updateUser/${userSession.id}`,
        { addresses: updatedAddresses },
        { withCredentials: true }
      );
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error updating default address:", error);
    }
  };

  return (
    <div className="profile-info">
      <h2>Shipping Addresses</h2>
      {addresses.length > 0 ? (
        addresses.map((address, index) => (
          <div
            key={index}
            className={`address-box ${address.isDefault ? "default" : ""}`}
          >
            <p>
              <strong>Address 1:</strong> {address.address1}
            </p>
            <p>
              <strong>Address 2:</strong> {address.address2 || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {address.city}
            </p>
            <p>
              <strong>Country:</strong> {address.country}
            </p>
            <p>
              <strong>Postal Code:</strong> {address.postalCode}
            </p>
            {address.isDefault ? (
              <strong>(Default Address)</strong>
            ) : (
              <button onClick={() => handleSetDefault(index)}>
                Set as Default
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No shipping addresses added yet.</p>
      )}

      <h3>Add New Address</h3>
      <div className="shipping-form">
        <input
          type="text"
          name="address1"
          placeholder="Address 1"
          value={newAddress.address1}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="address2"
          placeholder="Address 2 (Optional)"
          value={newAddress.address2}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={newAddress.city}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={newAddress.postalCode}
          onChange={handleInputChange}
          required
        />
        <Select
          options={countries}
          onChange={handleCountryChange}
          placeholder="Select Country"
          isSearchable
          value={countries.find((c) => c.label === newAddress.country) || null}
        />
        <label>
          <input
            type="checkbox"
            checked={newAddress.isDefault}
            onChange={() =>
              setNewAddress((prev) => ({ ...prev, isDefault: !prev.isDefault }))
            }
          />
          Set as Default
        </label>
        <button onClick={handleAddAddress}>Add Address</button>
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        message={dialogMessage}
        onClose={() => setDialogOpen(false)}
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default ShippingInfoPopup;
