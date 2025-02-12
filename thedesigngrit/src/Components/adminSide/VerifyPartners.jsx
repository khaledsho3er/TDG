import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";

import AdminPageLayout from "./adminLayout";
const VerifyPartners = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const partner = location.state?.partner; // Get partner data from state

  if (!partner) {
    return (
      <div>
        <p>No partner data available. Please go back and select a partner.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

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
        navigate(-1); // Go back after updating
      } else {
        alert(`Error updating status: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating partner status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <AdminPageLayout>
      <div className="verify-partners">
        <h2>Request Partnership</h2>
        <div className="partner-card">
          <div className="partner-info">
            <img
              src={`https://tdg-db.onrender.com/uploads/${partner.brandlogo}`}
              alt={`${partner.brand} Logo`}
            />
            <div>
              <h3>Brand:</h3>
              <p>{partner.brandName}</p>
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
                <p>{partner.brandName}</p>
              </div>
              <div>
                <h4>Email:</h4>
                <p>{partner.email}</p>
              </div>
            </div>
            <div>
              <h4>Phone Number:</h4>
              <p>{partner.phoneNumber}</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h4>Country:</h4>
                <p>{partner.country}</p>
              </div>
              <div>
                <h4>City:</h4>
                <p>{partner.city}</p>
              </div>
            </div>
            <div>
              <h4>Notes:</h4>
              <p>{partner.brandDescription}</p>
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
    </AdminPageLayout>
  );
};

export default VerifyPartners;
