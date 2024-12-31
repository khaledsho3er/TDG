import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const RequestsPartners = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const partnersPerPage = 12; // Number of partners per page

  // Fetch data from JSON or API
  const fetchPartners = async () => {
    try {
      const response = await fetch("/json/partnersRequest.json"); // Update the path if needed
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Pagination Logic
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = partners.slice(
    indexOfFirstPartner,
    indexOfLastPartner
  );

  const totalPages = Math.ceil(partners.length / partnersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to the details page with selected partner data
  const handleMoreDetails = (partner) => {
    navigate("/verify-partner", { state: { partner } }); // Pass the selected partner
  };
  return (
    <div className="product-list-page-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Partner Requests</h2>
          <p>Home &gt; Partner Requests</p>
        </div>
      </header>

      <div className="vendor-products-list-grid">
        {currentPartners.map((partner) => (
          <div className="product-card-request" key={partner.id}>
            <div className="product-card-header">
              <img
                src={partner.brandLogo}
                alt={`${partner.brand} Logo`}
                className="request-image"
              />
              <div className="request-info-vendor">
                <h3>{partner.brand}</h3>
                <p>
                  <strong>Requestor:</strong> {partner.requestorName}
                </p>
                <p>
                  <strong>Email:</strong> {partner.email}
                </p>
                <p>
                  <strong>Phone:</strong> {partner.phone}
                </p>
                <p>
                  <strong>Location:</strong> {partner.city}, {partner.country}
                </p>
              </div>
            </div>
            <div className="request-card-body">
              <p className="requests-summary">
                {partner.notes.substring(0, 100)}...
              </p>
              <button
                onClick={() => handleMoreDetails(partner)}
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
        ))}
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default RequestsPartners;
