import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Menudrop = ({ category, details, onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();
  console.log("Category in Menudrop:", category);

  // const [selectedDetail, setSelectedDetail] = useState(
  //   details.subCategories[0]
  // ); // Set initial subcategory
  const [selectedDetail, setSelectedDetail] = useState(null);
  useEffect(() => {
    if (details?.subCategories?.length > 0) {
      setSelectedDetail(details.subCategories[0]); // Automatically select the first subcategory
    } else {
      setSelectedDetail(null); // Reset if no subcategories
    }
  }, [details]);
  const handleNavigation = () => {
    if (category?._id && category?.name) {
      navigate(`/category/${category._id}/${category.name}`);
    } else {
      console.error("Invalid category data:", category);
    }
  };

  // Handle clicking a title to update the selected detail
  const handleTitleClick = (detail) => {
    setSelectedDetail(detail);
  };
  // const fullImagePath = selectedDetail
  //   ? `http://localhost:5000/uploads/${selectedDetail.image}`
  //   : ""; // Full image path for rendering

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
          {details.subCategories.map((subCategory, index) => (
            <div
              key={index}
              className="menu-item"
              onClick={() => handleTitleClick(subCategory)}
              style={{ cursor: "pointer" }}
            >
              <h3>{subCategory.name}</h3> {/* Display subcategory name */}
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="menu-right-container">
        <div className="menu-right">
          {selectedDetail ? (
            <>
              <h2>{selectedDetail.name}</h2>
              <ul>
                {selectedDetail.types.map((type, idx) => (
                  <li key={idx}>{type.name}</li> // Display type names
                ))}
              </ul>
            </>
          ) : null}
        </div>
        {selectedDetail && (
          <img
            src="/Assets/concept1.png" // Display category image
            alt={category}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}
      </div>
    </div>
  );
};

export default Menudrop;
