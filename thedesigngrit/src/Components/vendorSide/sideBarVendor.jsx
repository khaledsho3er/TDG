import React, { useEffect, useState } from "react";
import { useVendor } from "../../utils/vendorContext";
import { RiDashboard3Fill } from "react-icons/ri";
import { LuPackageOpen } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { FaMoneyBill } from "react-icons/fa6";
import { HiBuildingStorefront } from "react-icons/hi2";
import { MdAccountBalance } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { FaWpforms, FaBell, FaUsers } from "react-icons/fa";

// import { RiFileExcel2Fill } from "react-icons/ri";

const SidebarVendor = ({ setActivePage, activePage, collapsed }) => {
  // Get vendor data (including tier) from the useVendor hook
  const { vendor } = useVendor();

  // Local state to track if the vendor data has been loaded
  const [isVendorLoaded, setIsVendorLoaded] = useState(false);

  useEffect(() => {
    if (vendor) {
      setIsVendorLoaded(true); // Set to true once vendor data is available
    } else {
      // Fallback: Check if vendor data is available in localStorage (if persisted)
      const storedVendor = JSON.parse(localStorage.getItem("vendor"));
      if (storedVendor) {
        setIsVendorLoaded(true);
      }
    }
  }, [vendor]);

  // Function to handle active page highlighting
  const getActiveClass = (page) => {
    return activePage === page
      ? "sidebar-item-vendor active"
      : "sidebar-item-vendor";
  };

  // Return a loading spinner or message until vendor data is loaded
  if (!isVendorLoaded) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <aside className={`sidebar-vendor ${collapsed ? "collapsed" : ""}`}>
      <ul className="sidebar-menu-vendor">
        <li
          onClick={() => setActivePage("dashboard")}
          className={getActiveClass("dashboard")}
          title="Dashboard" // Tooltip
        >
          <RiDashboard3Fill size={20} style={{ marginRight: "5px" }} />
          {!collapsed && <span style={{ marginLeft: "8px" }}>Dashboard</span>}
        </li>
        <li
          onClick={() => setActivePage("notifications")}
          className={getActiveClass("notifications")}
          title="Notifications" // Tooltip
        >
          <FaBell size={20} style={{ marginRight: "5px" }} />

          {!collapsed && (
            <span style={{ marginLeft: "8px" }}>Notifications</span>
          )}
        </li>
        <li
          onClick={() => setActivePage("allProducts")}
          className={getActiveClass("allProducts")}
          title="All Products" // Tooltip
        >
          <LuPackageOpen size={20} style={{ marginRight: "5px" }} />
          {!collapsed && (
            <span style={{ marginLeft: "8px" }}>All Products</span>
          )}
        </li>
        <li
          onClick={() => setActivePage("orderList")}
          className={getActiveClass("orderList")}
          title="Order List" // Tooltip
        >
          <TbTruckDelivery size={20} style={{ marginRight: "5px" }} />
          Order List
          {!collapsed && <span style={{ marginLeft: "8px" }}>Order List</span>}
        </li>
        <li
          onClick={() => setActivePage("quotationsList")}
          className={getActiveClass("quotationsList")}
          title="Quotations List" // Tooltip
        >
          <FaMoneyBill size={20} style={{ marginRight: "5px" }} />
          {!collapsed && (
            <span style={{ marginLeft: "8px" }}>Quotation List</span>
          )}
        </li>
        <li
          onClick={() => setActivePage("ViewInStoreVendor")}
          className={getActiveClass("ViewInStoreVendor")}
          title="View In Store" // Tooltip
        >
          <HiBuildingStorefront size={20} style={{ marginRight: "5px" }} />

          {!collapsed && (
            <span style={{ marginLeft: "8px" }}>View In Store</span>
          )}
        </li>

        <li
          onClick={() => setActivePage("promotionsPage")}
          className={getActiveClass("promotionsPage")}
          title="Promotions" // Tooltip
        >
          <FaMoneyBill size={20} style={{ marginRight: "5px" }} />
          {!collapsed && <span style={{ marginLeft: "8px" }}>Promotions</span>}
        </li>

        {/* Render "Brand Form" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandForm")}
            className={getActiveClass("BrandForm")}
            title="Brand Form" // Tooltip
          >
            <FaWpforms size={20} style={{ marginRight: "5px" }} />
            {!collapsed && (
              <span style={{ marginLeft: "8px" }}>Brand Form</span>
            )}
          </li>
        )}
        {/* Render "Add Employee" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandingPage")}
            className={getActiveClass("BrandingPage")}
            title="Branding Page" // Tooltip
          >
            <ImProfile size={20} style={{ marginRight: "5px" }} />
            {!collapsed && (
              <span style={{ marginLeft: "8px" }}>Brand Profile</span>
            )}
          </li>
        )}
        {/* Render "Add Employee" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("Accounting")}
            className={getActiveClass("Accounting")}
            title="Accounting" // Tooltip
          >
            <MdAccountBalance size={20} style={{ marginRight: "5px" }} />
            {!collapsed && (
              <span style={{ marginLeft: "8px" }}>Accounting</span>
            )}
          </li>
        )}

        {/* Render "Employee Page" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("EmployeePage")}
            className={getActiveClass("EmployeePage")}
            title="Employee Page" // Tooltip
          >
            <FaUsers size={20} style={{ marginRight: "5px" }} />
            {!collapsed && <span style={{ marginLeft: "8px" }}>Employees</span>}
          </li>
        )}
      </ul>
    </aside>
  );
};

export default SidebarVendor;
