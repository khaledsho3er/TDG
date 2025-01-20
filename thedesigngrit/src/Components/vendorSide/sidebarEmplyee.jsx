import React, { useContext } from "react";
import { EmployeeContext } from "../../utils/empContext"; // Import EmployeeContext

const SidebarEmployee = ({ setActivePage, activePage }) => {
  const { employeeSession } = useContext(EmployeeContext); // Access employee session from context
  const tier = employeeSession?.tier || 0; // Default to 0 if tier is missing

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

        {/* Show Add Product only if Tier 2 or higher */}
        {tier >= 2 && (
          <li
            onClick={() => setActivePage("AddProduct")}
            className={getActiveClass("AddProduct")}
          >
            Add Product
          </li>
        )}
      </ul>
    </aside>
  );
};

export default SidebarEmployee;
