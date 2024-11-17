// components/ProductShowcase.js
import React from "react";
import { GiCheckMark } from "react-icons/gi";

function ProductShowcase() {
  return (
    <div className="product-showcase">
      <h2>
        Your Source to <br />
        Design Your Life
      </h2>
      <ul className="features">
        <li>
          {" "}
          <GiCheckMark className="checkIcons" />
          320,000 Products
        </li>
        <li>
          {" "}
          <GiCheckMark className="checkIcons" />
          3,500 Brands
        </li>
        <li>
          {" "}
          <GiCheckMark className="checkIcons" />
          Catalogue, BIM, CAD
        </li>
      </ul>
      <div className="cards"></div>
    </div>
  );
}

export default ProductShowcase;
