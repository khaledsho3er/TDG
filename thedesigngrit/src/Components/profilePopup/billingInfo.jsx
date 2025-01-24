import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import BillingInfoPopup from "./BillingInfoPop";
import ConfirmationDialog from "../confirmationMsg";

const BillingInfo = () => {
  const [savedCards, setSavedCards] = useState([
    { id: 1, cardNumber: "4111111111111234", type: "Visa", isDefault: true },
    {
      id: 2,
      cardNumber: "5500000000005678",
      type: "Mastercard",
      isDefault: false,
    },
  ]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [pendingDefaultCard, setPendingDefaultCard] = useState(null);

  const handleSetDefault = (cardId) => {
    setPendingDefaultCard(cardId);
    setShowConfirmation(true);
  };

  const confirmSetDefault = () => {
    setSavedCards((prev) =>
      prev.map((card) => ({
        ...card,
        isDefault: card.id === pendingDefaultCard,
      }))
    );
    setShowConfirmation(false);
    setPendingDefaultCard(null);
  };

  const cancelSetDefault = () => {
    setShowConfirmation(false);
    setPendingDefaultCard(null);
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setIsAddingNew(false);
    setShowPopup(true);
  };

  const handleAddNew = () => {
    setSelectedCard(null);
    setIsAddingNew(true);
    setShowPopup(true);
  };

  const handleSaveCard = (cardDetails) => {
    if (isAddingNew) {
      setSavedCards((prev) => [
        ...prev,
        { id: Date.now(), ...cardDetails, isDefault: false },
      ]);
      setConfirmationMessage("New payment method added successfully!");
    } else {
      setSavedCards((prev) =>
        prev.map((card) =>
          card.id === selectedCard.id ? { ...card, ...cardDetails } : card
        )
      );
      setConfirmationMessage("Payment method updated successfully!");
    }
    setShowPopup(false);
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <Box
      // sx={{
      //   display: "flex",
      //   flexDirection: "column",
      //   justifyContent: "center",
      //   margin: "auto",
      //   width: "100%",
      //   alignItems: "center",
      //   fontFamily: "Montserrat",
      //   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      //   border: "1px solid #6c7c59",
      //   borderRadius: "5px",
      //   padding: "20px",
      // }}
      className="profile-info"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="saved-cards"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          fontFamily: "Montserrat",
          overflow: "auto",
          maxHeight: "300px",
          paddingTop: savedCards.length > 3 ? "100px" : "0px",
        }}
      >
        {savedCards.map((card) => (
          <Box
            key={card.id}
            className={`card-box ${card.isDefault ? "default-card" : ""}`}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "10px",
              width: "60%",
              padding: "15px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              color: "#2d2d2d",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "Column",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <p style={{ color: "#2d2d2d" }}>
                **** **** **** {card.cardNumber.slice(-4)}
              </p>
              <p style={{ color: "#2d2d2d" }}>{card.type}</p>
            </Box>
            <Box sx={{ display: "flex", gap: "5px", flexDirection: "Column" }}>
              <button
                onClick={() => handleSetDefault(card.id)}
                style={{
                  backgroundColor: "#6c7c59",
                  color: "#fff",
                }}
              >
                {card.isDefault ? "Default" : "Set as Default"}
              </button>
              <button
                onClick={() => handleEditCard(card)}
                style={{
                  backgroundColor: "#6c7c59",
                  color: "#fff",
                }}
              >
                Edit
              </button>
            </Box>
          </Box>
        ))}
      </div>
      <div className="AddnewPayment">
        <Button variant="contained" onClick={handleAddNew}>
          Add New Payment Method
        </Button>
      </div>
      <BillingInfoPopup
        open={showPopup}
        card={selectedCard}
        isAddingNew={isAddingNew}
        onSave={handleSaveCard}
        onCancel={handleCancel}
      />
      <ConfirmationDialog
        open={showConfirmation}
        title="Success"
        content={confirmationMessage}
        onConfirm={handleConfirmationClose}
        onCancel={handleConfirmationClose}
      />
      <ConfirmationDialog
        open={showConfirmation}
        title="Set Default Card"
        content="Are you sure you want to set this card as the default?"
        onConfirm={confirmSetDefault}
        onCancel={cancelSetDefault}
      />
    </Box>
  );
};

export default BillingInfo;
