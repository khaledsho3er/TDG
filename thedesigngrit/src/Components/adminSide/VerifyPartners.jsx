import React from "react";
import { IconButton } from "@mui/material";
import { IoMdEye, IoMdArrowBack } from "react-icons/io";

const VerifyPartners = ({ partner, onBack }) => {
  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `https://tdg-db.onrender.com/api/brand/partners/${partner._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`Partner status updated to: ${newStatus}`);
        onBack();
      } else {
        alert(`Error updating status: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating partner status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <>
      <IconButton className="back-btn" onClick={onBack}>
        <IoMdArrowBack />
      </IconButton>
      <div className="verify-partners">
        <h2>Request Partnership</h2>
        <div className="partner-card">
          <div className="partner-info">
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${partner.brandlogo}`}
              alt={`${partner.brand} Logo`}
            />
            <div>
              <h3>Brand:</h3>
              <p>{partner.brandName || "Unknown"}</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h4>Requestor Name:</h4>
                <p>{partner.brandName || "Unknown"}</p>
              </div>
              <div>
                <h4>Email:</h4>
                <p>{partner.email || "Unknown"}</p>
              </div>
            </div>
            <div>
              <h4>Phone Number:</h4>
              <p>{partner.phoneNumber || "Unknown"}</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h4>Website:</h4>
                <p>{partner.websiteURL || "Unknown"}</p>
              </div>
              <div>
                <h4>Instagram:</h4>
                <p>{partner.instagramURL || "Unknown"}</p>
              </div>
            </div>
            <div>
              <h4>Notes:</h4>
              <p>{partner.brandDescription || "Unknown"}</p>
            </div>
            <div>
              <h4>Documents:</h4>
              <ul>
                {partner.documents.map((doc, index) => (
                  <li key={index}>
                    {doc} <IoMdEye />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="action-buttons">
            <button
              className="approve-btn"
              onClick={() => updateStatus("active")}
            >
              Approve
            </button>
            <button
              className="reject-btn"
              onClick={() => updateStatus("rejected")}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyPartners;
