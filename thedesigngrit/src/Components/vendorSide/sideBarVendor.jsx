import React from "react";

const SidebarVendor = ({ setActivePage, activePage, user }) => {
  // Function to handle active page highlighting
  const getActiveClass = (page) => {
    return activePage === page
      ? "sidebar-item-vendor active"
      : "sidebar-item-vendor";
  };

  // Check if the user is an employee and their tier level
  const isEmployee = user?.role === "Employee";
  const tier = user?.tier;

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

        {/* Hide Add Product for Tier 1 and 2 employees */}
        {!isEmployee || tier > 2 ? (
          <li
            onClick={() => setActivePage("AddProduct")}
            className={getActiveClass("AddProduct")}
          >
            Add Product
          </li>
        ) : null}

        {/* Hide Brand Form for Tier 1 and 2 employees */}
        {!isEmployee || tier > 2 ? (
          <li
            onClick={() => setActivePage("BrandForm")}
            className={getActiveClass("BrandForm")}
          >
            Brand Form
          </li>
        ) : null}
        {/* Hide Brand Form for Tier 1 and 2 employees */}
        {!isEmployee || tier > 2 ? (
          <li
            onClick={() => setActivePage("BrandForm")}
            className={getActiveClass("BrandForm")}
          >
            Brand Form
          </li>
        ) : null}

        {/* Hide Accounting for Tier 1 and 2 employees */}
        {!isEmployee || tier > 2 ? (
          <li
            onClick={() => setActivePage("Accounting")}
            className={getActiveClass("Accounting")}
          >
            Accounting
          </li>
        ) : null}

        {/* Hide Add Employee for Tier 1 and 2 employees */}
        {!isEmployee || tier > 2 ? (
          <li
            onClick={() => setActivePage("EmployeeSignup")}
            className={getActiveClass("EmployeeSignup")}
          >
            Add Employee
          </li>
        ) : null}

        {/* Hide Employee Page for Tier 1 and 2 employees */}
        {!isEmployee || tier > 2 ? (
          <li
            onClick={() => setActivePage("EmployeePage")}
            className={getActiveClass("EmployeePage")}
          >
            EmployeePage
          </li>
        ) : null}
      </ul>
    </aside>
  );
};

export default SidebarVendor;
