import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";

const NavbarVendor = () => {
  return (
    <nav className="navbar-vendor">
      <div className="navbar-logo-vendor">
        <img src="/Assets/PartnersLogos/ArtHouseLogo.png" alt="Vendor Logo" />
      </div>
      <div className="navbar-actions-vendor">
        <FaSearch className="icon-vendor-bar" />
        <FaBell className="icon-vendor-bar" />
        <select>
          <option>Manager</option>
          <option>Settings</option>
          <option>Logout</option>
        </select>
      </div>
    </nav>
  );
};

export default NavbarVendor;
