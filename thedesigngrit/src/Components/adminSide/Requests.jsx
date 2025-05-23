import React, { useEffect, useState, useCallback } from "react";
import { IoIosArrowForward } from "react-icons/io";
import VerifyPartners from "./VerifyPartners";
import { Box, CircularProgress } from "@mui/material"; // Import Box and CircularProgress

const RequestsPartners = () => {
  const [partners, setPartners] = useState([]);
  const [status] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const partnersPerPage = 12; // Number of partners per page

  // استخدام useCallback لتثبيت الدالة
  const fetchPartners = useCallback(async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(
        `https://api.thedesigngrit.com/api/brand/status/${status}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setIsLoading(false); // Set loading to false when fetching completes
    }
  }, [status]); // طالما status ثابت مش هيحصل re-render

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Pagination Logic
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = partners.slice(
    indexOfFirstPartner,
    indexOfLastPartner
  );

  const totalPages = Math.ceil(partners.length / partnersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (selectedPartner) {
    return (
      <VerifyPartners
        partner={selectedPartner}
        onBack={() => setSelectedPartner(null)}
      />
    );
  }

  return (
    <div className="product-list-page-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Partner Requests</h2>
          <p>Home &gt; Partner Requests</p>
        </div>
      </header>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            width: "100%",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#6b7b58" }} />
        </Box>
      ) : (
        <>
          <div className="vendor-products-list-grid">
            {currentPartners.length > 0 ? (
              currentPartners.map((partner) => (
                <div className="product-card-request" key={partner._id}>
                  <div className="product-card-header">
                    <img
                      src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${partner.brandlogo}`}
                      alt={`Logo`}
                      className="request-image"
                    />
                    <div className="request-info-vendor">
                      <h3>{partner.brandName}</h3>
                      <p>
                        <strong>Requestor:</strong> {partner.brandName}
                      </p>
                      <p>
                        <strong>Email:</strong> {partner.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {partner.phoneNumber}
                      </p>
                      <p>
                        <strong>Location:</strong> {partner.city},{" "}
                        {partner.country}
                      </p>
                    </div>
                  </div>
                  <div className="request-card-body">
                    <p className="requests-summary">
                      {partner.brandDescription.substring(0, 100)}...
                    </p>
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#2d2d2d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      More Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "40px 0",
                  gridColumn: "1 / -1",
                }}
              >
                <p>No pending partner requests found.</p>
              </div>
            )}
          </div>

          {/* Pagination - only show if there are partners */}
          {partners.length > 0 && (
            <div
              className="pagination"
              style={{ textAlign: "left", margin: "120px 0" }}
            >
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  style={{
                    margin: "5px",
                    padding: "8px 12px",
                    backgroundColor:
                      currentPage === index + 1 ? "#2d2d2d" : "#efebe8",
                    color: currentPage === index + 1 ? "#fff" : "#2d2d2d",
                    border:
                      currentPage === index + 1
                        ? "1px solid #2d2d2d"
                        : "1px solid #2d2d2d",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: currentPage === index + 1 ? "bold" : "normal",
                  }}
                >
                  {index + 1}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  onClick={() => paginate(currentPage + 1)}
                  style={{
                    margin: "5px",
                    padding: "8px 12px",
                    backgroundColor: "#efebe8",
                    border: "1px solid #2d2d2d",
                    borderRadius: "5px",
                    cursor: "pointer",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  NEXT{" "}
                  <IoIosArrowForward
                    style={{ color: "#2d2d2d", marginBottom: "-2px" }}
                  />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RequestsPartners;
