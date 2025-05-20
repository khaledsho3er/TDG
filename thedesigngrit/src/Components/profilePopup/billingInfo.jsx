import React, { useState, useEffect, useContext } from "react";
import { Box, Button } from "@mui/material";
import BillingInfoPopup from "./BillingInfoPop";
import ConfirmationDialog from "../confirmationMsg";
import { UserContext } from "../../utils/userContext";
import axios from "axios";

const BillingInfo = () => {
  const [savedCards, setSavedCards] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingDefaultCard, setPendingDefaultCard] = useState(null);
  const { userSession } = useContext(UserContext);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const userId = userSession.id;

  // Function to fetch cards from API
  const fetchCards = () => {
    fetch(`https://api.thedesigngrit.com/api/cards/user/${userId}`)
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
  };

  // Fetch saved cards from the API
  useEffect(() => {
    fetchCards();
  }, [userId]);

  const handleSetDefault = (cardId) => {
    setPendingDefaultCard(cardId);
    setShowConfirmation(true);
  };

  const confirmSetDefault = () => {
    fetch(`https://api.thedesigngrit.com/api/cards/set-default`, {
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

  const handleDeleteClick = (cardId) => {
    setCardToDelete(cardId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;

    try {
      const response = await axios.delete(
        `https://api.thedesigngrit.com/api/cards/${cardToDelete}`
      );
      console.log(response.data.message);
      setSavedCards((prev) => prev.filter((card) => card.id !== cardToDelete));
    } catch (error) {
      console.error(
        "Error deleting card:",
        error.response?.data?.message || error.message
      );
    } finally {
      setShowDeleteConfirmation(false);
      setCardToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedCard(null);
    setIsAddingNew(true);
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  // Handle card save (new or updated)
  const handleCardSave = () => {
    // Refresh the cards list without page reload
    fetchCards();
  };

  return (
    <Box
      className="profile-info"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
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
            className={`card-box ${card.isDefault ? "default-card" : ""}`}
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
              <p style={{ color: "#2d2d2d" }}>
                **** **** **** {card.cardNumber.slice(-4)}
              </p>
              <p style={{ color: "#2d2d2d" }}>{card.type}</p>
            </Box>
            <Box sx={{ display: "flex", gap: "5px", flexDirection: "column" }}>
              <button
                onClick={() => handleSetDefault(card.id)}
                style={{ backgroundColor: "#6c7c59", color: "#fff" }}
              >
                {card.isDefault ? "Default" : "Set as Default"}
              </button>
              <button
                onClick={() => handleDeleteClick(card.id)}
                style={{ backgroundColor: "#6c7c59", color: "#fff" }}
              >
                Delete
              </button>
            </Box>
          </Box>
        ))}
      </div>
      <Button
        sx={{
          backgroundColor: "#6c7c59",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#6c7c59", // Change to desired hover color
            color: "fff", // Change text color on hover if needed
          },
        }}
        variant="contained"
        onClick={handleAddNew}
      >
        Add New Payment Method
      </Button>

      <BillingInfoPopup
        open={showPopup}
        card={selectedCard}
        isAddingNew={isAddingNew}
        onCancel={handleCancel}
        onSave={handleCardSave}
        userId={userId} // Ensure this is available in the parent component
      />

      <ConfirmationDialog
        open={showConfirmation}
        title="Set Default Card"
        content="Are you sure you want to set this card as the default?"
        onConfirm={confirmSetDefault}
        onCancel={handleConfirmationClose}
      />
      <ConfirmationDialog
        open={showDeleteConfirmation}
        title="Delete Card"
        content="Are you sure you want to delete this card?"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </Box>
  );
};

export default BillingInfo;
