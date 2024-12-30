import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Menudrop = ({ category, details, onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();

  // State to track the currently selected detail
  const [selectedDetail, setSelectedDetail] = useState(details[0]);

  const handleNavigation = () => {
    navigate(`/shop/${category}`);
  };

  // Handle clicking a title to update the selected detail
  const handleTitleClick = (detail) => {
    setSelectedDetail(detail);
  };

  return (
    <div
      className="menu-overlay"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Left Section */}
      <div className="menu-left-container">
        <h2 className="topcategory-title">{category}</h2>
        <div className="menu-left">
          <div className="menu-item">
            <h3 onClick={handleNavigation}>Shop all {category}</h3>
          </div>
          {details.map((detail, index) => (
            <div
              key={index}
              className="menu-item"
              onClick={() => handleTitleClick(detail)}
              style={{ cursor: "pointer" }}
            >
              <h3>{detail.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="menu-right-container">
        <div className="menu-right">
          {selectedDetail && (
            <>
              <h2 className="">{selectedDetail.title}</h2>
              <ul>
                {selectedDetail.subcategories.map((sub, idx) => (
                  <li key={idx}>{sub}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {selectedDetail && (
          <img
            src={selectedDetail.image}
            alt={selectedDetail.title}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}
      </div>
    </div>
  );
};

export default Menudrop;
