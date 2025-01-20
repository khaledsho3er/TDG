import React from "react";

const SidebarVendor = ({ setActivePage }) => {
  return (
    <aside className="sidebar-vendor">
      <ul className="sidebar-menu-vendor">
        <li
          onClick={() => setActivePage("dashboard")}
          className="sidebar-item-vendor"
        >
          Dashboard
        </li>
        <li
          onClick={() => setActivePage("allProducts")}
          className="sidebar-item-vendor"
        >
          All Products
        </li>
        <li
          onClick={() => setActivePage("orderList")}
          className="sidebar-item-vendor"
        >
          Order List
        </li>
        <li
          onClick={() => setActivePage("AddProduct")}
          className="sidebar-item-vendor"
        >
          Add Product
        </li>
        <li
          onClick={() => setActivePage("BrandForm")}
          className="sidebar-item-vendor"
        >
          Brand Form
        </li>
        <li
          onClick={() => setActivePage("BrandingPage")}
          className="sidebar-item-vendor"
        >
          Brand Profile
        </li>
        <li
          onClick={() => setActivePage("BrandingPage")}
          className="sidebar-item-vendor"
        >
          Accounting
        </li>
      </ul>
    </aside>
  );
};

export default SidebarVendor;
