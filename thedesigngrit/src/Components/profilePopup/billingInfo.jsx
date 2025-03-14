import React, { useState, useEffect, useContext } from "react";
import { Box, Button } from "@mui/material";
import BillingInfoPopup from "./BillingInfoPop";
import ConfirmationDialog from "../confirmationMsg";
import { UserContext } from "../../utils/userContext";

const BillingInfo = () => {
  const [savedCards, setSavedCards] = useState([]); // State to store saved cards
  const [showPopup, setShowPopup] = useState(false); // Controls billing info popup visibility
  const [selectedCard, setSelectedCard] = useState(null); // Stores the selected card for editing
  const [isAddingNew, setIsAddingNew] = useState(false); // Determines if adding a new card
  const [showConfirmation, setShowConfirmation] = useState(false); // Controls confirmation dialog visibility
  const [confirmationMessage, setConfirmationMessage] = useState(""); // Message for confirmation dialog
  const [pendingDefaultCard, setPendingDefaultCard] = useState(null); // Temporarily stores card ID for setting default
  const { userSession } = useContext(UserContext);
  const userId = userSession.id;

  // Fetch saved cards from the API
  useEffect(() => {
    fetch(`https://tdg-db.onrender.com/api/cards/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setSavedCards(
          data.map((card) => ({
            id: card._id,
            cardNumber: card.cardNumber,
            type: card.cardType,
            isDefault: card.default,
          }))
        );
      })
      .catch((error) => console.error("Error fetching cards:", error));
  }, []);

  // Handle setting a card as the default
  const handleSetDefault = (cardId) => {
    setPendingDefaultCard(cardId);
    setShowConfirmation(true);
  };

  // Confirm setting a card as the default and update the backend
  const confirmSetDefault = () => {
    fetch(`https://tdg-db.onrender.com/api/cards/set-default`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, cardId: pendingDefaultCard }),
    })
      .then((response) => response.json())
      .then(() => {
        setSavedCards((prev) =>
          prev.map((card) => ({
            ...card,
            isDefault: card.id === pendingDefaultCard,
          }))
        );
        setShowConfirmation(false);
      })
      .catch((error) => console.error("Error updating default card:", error));
  };

  // Handle editing an existing card
  const handleEditCard = (card) => {
    setSelectedCard(card);
    setIsAddingNew(false);
    setShowPopup(true);
  };

  // Handle adding a new card
  const handleAddNew = () => {
    setSelectedCard(null);
    setIsAddingNew(true);
    setShowPopup(true);
  };

  // Close the billing info popup
  const handleCancel = () => {
    setShowPopup(false);
  };

  // Close the confirmation dialog
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <Box
      className="profile-info"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Display saved cards */}
      <div
        className="saved-cards"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxHeight: "300px",
          overflow: "auto",
        }}
      >
        {savedCards.map((card) => (
          <Box
            key={card.id}
            className={`card-box ${card.default ? "default-card" : ""}`}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "10px",
              width: "60%",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#fff",
            }}
          >
            <Box>
              <p>**** **** **** {card.cardNumber.slice(-4)}</p>
              <p>{card.cardType}</p>
            </Box>
            <Box sx={{ display: "flex", gap: "5px", flexDirection: "column" }}>
              <button
                onClick={() => handleSetDefault(card._id)}
                style={{ backgroundColor: "#6c7c59", color: "#fff" }}
              >
                {card.default ? "Default" : "Set as Default"}
              </button>
              <button
                onClick={() => handleEditCard(card)}
                style={{ backgroundColor: "#6c7c59", color: "#fff" }}
              >
                Edit
              </button>
            </Box>
          </Box>
        ))}
      </div>

      {/* Button to add a new payment method */}
      <Button variant="contained" onClick={handleAddNew}>
        Add New Payment Method
      </Button>

      {/* Billing info popup component */}
      <BillingInfoPopup
        open={showPopup}
        card={selectedCard}
        isAddingNew={isAddingNew}
        onCancel={handleCancel}
      />

      {/* Confirmation dialog for setting default card */}
      <ConfirmationDialog
        open={showConfirmation}
        title="Set Default Card"
        content="Are you sure you want to set this card as the default?"
        onConfirm={confirmSetDefault}
        onCancel={handleConfirmationClose}
      />
    </Box>
  );
};

export default BillingInfo;
