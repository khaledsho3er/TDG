import React from "react";

const SidebarAdmin = ({ setActivePage }) => {
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
          onClick={() => setActivePage("adminNotificationPage")}
          className="sidebar-item-vendor"
        >
          Notifications
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
          onClick={() => setActivePage("Requests")}
          className="sidebar-item-vendor"
        >
          Requests
        </li>
        {/* <li
          onClick={() => setActivePage("createCategory")}
          className="sidebar-item-vendor"
        >
          Categories
        </li> */}
        <li
          onClick={() => setActivePage("categoriesList")}
          className="sidebar-item-vendor"
        >
          Categories
        </li>
        <li
          onClick={() => setActivePage("tags")}
          className="sidebar-item-vendor"
        >
          Tags
        </li>
        <li
          onClick={() => setActivePage("concepts")}
          className="sidebar-item-vendor"
        >
          Concepts
        </li>
        <li
          onClick={() => setActivePage("promotions")}
          className="sidebar-item-vendor"
        >
          Promotions
        </li>
        <li
          onClick={() => setActivePage("brandsManagement")}
          className="sidebar-item-vendor"
        >
          Brands
        </li>
        <li
          onClick={() => setActivePage("PendingBrandUpdates")}
          className="sidebar-item-vendor"
        >
          Brands Changes
        </li>{" "}
        <li
          onClick={() => setActivePage("PendingProductsUpdates")}
          className="sidebar-item-vendor"
        >
          Products Changes
        </li>{" "}
        <li
          onClick={() => setActivePage("contactusRequests")}
          className="sidebar-item-vendor"
        >
          ContactUs Requests
        </li>
        <li
          onClick={() => setActivePage("AllEmployees")}
          className="sidebar-item-vendor"
        >
          Brands Employees
        </li>
        <li
          onClick={() => setActivePage("ourEmployees")}
          className="sidebar-item-vendor"
        >
          Our Employees
        </li>
      </ul>
    </aside>
  );
};

export default SidebarAdmin;
