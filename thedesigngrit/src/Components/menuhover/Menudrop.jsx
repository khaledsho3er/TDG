import React from "react";

const Menudrop = ({ category, details, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className="menu-overlay"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="menu-left-container">
        <h2>{category}</h2>
        <div className="menu-left">
          {details.map((detail, index) => (
            <div key={index} className="menu-item">
              <h3>{detail.title}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="menu-right-container">
        <div className="menu-right">
          {details.length > 0 && (
            <>
              <h2>{details[0].title}</h2>
              <ul>
                {details[0].subcategories.map((sub, idx) => (
                  <li key={idx}>{sub}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        <img src={details[0].image} alt={details[0].title} />
      </div>
    </div>
  );
};

export default Menudrop;
