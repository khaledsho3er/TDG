import React from "react";
import { useVendor } from "../../utils/vendorContext";

const SidebarVendor = ({ setActivePage, activePage }) => {
  // Get vendor data (including tier) from the useVendor hook
  const { vendor } = useVendor();

  // Function to handle active page highlighting
  const getActiveClass = (page) => {
    return activePage === page
      ? "sidebar-item-vendor active"
      : "sidebar-item-vendor";
  };

  return (
    <aside className="sidebar-vendor">
      <ul className="sidebar-menu-vendor">
        <li
          onClick={() => setActivePage("dashboard")}
          className={getActiveClass("dashboard")}
        >
          Dashboard
        </li>
        <li
          onClick={() => setActivePage("allProducts")}
          className={getActiveClass("allProducts")}
        >
          All Products
        </li>
        <li
          onClick={() => setActivePage("orderList")}
          className={getActiveClass("orderList")}
        >
          Order List
        </li>
        <li
          onClick={() => setActivePage("quotationsList")}
          className={getActiveClass("quotationsList")}
        >
          Quotation List
        </li>
        {/* Render "Add Product" only if vendor tier is 3 or higher */}
        {vendor.tier >= 3 && (
          <li
            onClick={() => setActivePage("AddProduct")}
            className={getActiveClass("AddProduct")}
          >
            Add Product
          </li>
        )}

        {/* Render "Brand Form" only if vendor tier is 3 or higher */}
        {vendor.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandForm")}
            className={getActiveClass("BrandForm")}
          >
            Brand Form
          </li>
        )}
        {/* Render "Add Employee" only if vendor tier is 3 or higher */}
        {vendor.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandingPage")}
            className={getActiveClass("BrandingPage")}
          >
            Brand Profile
          </li>
        )}
        {/* Render "Add Employee" only if vendor tier is 3 or higher */}
        {vendor.tier >= 3 && (
          <li
            onClick={() => setActivePage("Accounting")}
            className={getActiveClass("Accounting")}
          >
            Accounting
          </li>
        )}
        {/* Render "Add Employee" only if vendor tier is 3 or higher */}
        {vendor.tier >= 3 && (
          <li
            onClick={() => setActivePage("EmployeeSignup")}
            className={getActiveClass("EmployeeSignup")}
          >
            Add Employee
          </li>
        )}

        {/* Render "Employee Page" only if vendor tier is 3 or higher */}
        {vendor.tier >= 3 && (
          <li
            onClick={() => setActivePage("EmployeePage")}
            className={getActiveClass("EmployeePage")}
          >
            EmployeePage
          </li>
        )}
      </ul>
    </aside>
  );
};

export default SidebarVendor;
