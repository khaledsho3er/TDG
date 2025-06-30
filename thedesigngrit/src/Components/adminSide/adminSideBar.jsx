import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

const SidebarAdmin = ({ setActivePage }) => {
  // State for each section
  const [openSections, setOpenSections] = useState({
    general: true,
    management: true,
    changes: true,
    // accounting: false, // Uncomment if you add accounting
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

        {/* Management */}
        <li
          className="sidebar-section-title"
          onClick={() => toggleSection("management")}
        >
          Management{" "}
          {openSections.management ? <IoIosArrowForward /> : <IoIosArrowDown />}
        </li>
        {openSections.management && (
          <>
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
            <li
              onClick={() => setActivePage("contactusRequests")}
              className="sidebar-item-vendor"
            >
              ContactUs Requests
            </li>
          </>
        )}

        {/* Changes */}
        <li
          className="sidebar-section-title"
          onClick={() => toggleSection("changes")}
        >
          Changes{" "}
          {openSections.changes ? <IoIosArrowForward /> : <IoIosArrowDown />}
        </li>
        {openSections.changes && (
          <>
            <li
              onClick={() => setActivePage("PendingBrandUpdates")}
              className="sidebar-item-vendor"
            >
              Brands Changes
            </li>
            <li
              onClick={() => setActivePage("PendingProductsUpdates")}
              className="sidebar-item-vendor"
            >
              Products Changes
            </li>
          </>
        )}

        {/* Accounting (add items here if needed) */}
        {/* <li className="sidebar-section-title" onClick={() => toggleSection("accounting")}>
          Accounting {openSections.accounting ? "▼" : "►"}
        </li>
        {openSections.accounting && (
          <li onClick={() => setActivePage("accountingPage")} className="sidebar-item-vendor">Accounting</li>
        )} */}
      </ul>
    </aside>
  );
};

export default SidebarAdmin;
