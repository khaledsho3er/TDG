import React from "react";

const SidebarEmployee = ({ setActivePage, activePage, user }) => {
  // Function to handle active page highlighting
  const getActiveClass = (page) => {
    return activePage === page
      ? "sidebar-item-vendor active"
      : "sidebar-item-vendor";
  };

  // Extract tier and role from the user object
  const tier = user?.tier ? parseInt(user?.tier) : 0; // Default to 0 if tier is null or undefined

  // Log the tier for debugging purposes
  console.log("tier", tier);

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
