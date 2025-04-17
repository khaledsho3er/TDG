import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Menudrop = ({ category, onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    if (category?.subCategories?.length > 0) {
      setSelectedDetail(category.subCategories[0]); // Automatically select the first subcategory
    } else {
      setSelectedDetail(null); // Reset if no subcategories
    }
  }, [category]);

  // Navigate to the category page
  const handleNavigation = () => {
    if (category?._id && category?.name) {
      navigate(`/category/${category._id}/subcategories`);
    } else {
      console.error("Invalid category data:", category);
    }
  };

  const handlesubcategoryclick = (subcategory) => {
    navigate(`/types/${subcategory._id}`);
  };

  // Update selected detail when hovering over a subcategory
  const handleMouseEnterSubCategory = (subCategory) => {
    setSelectedDetail(subCategory);
  };

  // Navigate to products page with type ID and name
  const handleTypeClick = (type) => {
    navigate(`/products/${type._id}/${type.name}`);
  };

  return (
    <div
      className="menu-overlay"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Left Section */}
      <div className="menu-left-container">
        <h2 className="topcategory-title">{category.name}</h2>
        <div className="menu-left">
          <div className="menu-item">
            <h3 onClick={handleNavigation}>Shop all {category.name}</h3>
          </div>
          {category.subCategories.map((subCategory, index) => (
            <div
              key={index}
              className="menu-item"
              onClick={() => handlesubcategoryclick(subCategory)}
              onMouseEnter={() => handleMouseEnterSubCategory(subCategory)}
              style={{ cursor: "pointer" }}
            >
              <h3>{subCategory.name}</h3>
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
                  <li
                    key={idx}
                    onClick={() => handleTypeClick(type)}
                    style={{ cursor: "pointer" }}
                  >
                    {type.name}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
      <div>
        <div style={{ width: "100%", height: "100%", objectFit: "cover" }}>
          {selectedDetail && (
            <img
              src="/Assets/concept1.webp"
              alt={category.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Menudrop;
