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

const SidebarVendor = ({ setActivePage, activePage }) => {
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
    <aside className="sidebar-vendor">
      <ul className="sidebar-menu-vendor">
        <li
          onClick={() => setActivePage("dashboard")}
          className={getActiveClass("dashboard")}
        >
          <RiDashboard3Fill size={20} style={{ marginRight: "5px" }} />
          Dashboard
        </li>
        <li
          onClick={() => setActivePage("notifications")}
          className={getActiveClass("notifications")}
        >
          <FaBell size={20} style={{ marginRight: "5px" }} />
          Notifications
        </li>
        <li
          onClick={() => setActivePage("allProducts")}
          className={getActiveClass("allProducts")}
        >
          <LuPackageOpen size={20} style={{ marginRight: "5px" }} />
          All Products
        </li>
        <li
          onClick={() => setActivePage("orderList")}
          className={getActiveClass("orderList")}
        >
          <TbTruckDelivery size={20} style={{ marginRight: "5px" }} />
          Order List
        </li>
        <li
          onClick={() => setActivePage("quotationsList")}
          className={getActiveClass("quotationsList")}
        >
          <FaMoneyBill size={20} style={{ marginRight: "5px" }} />
          Quotation List
        </li>
        <li
          onClick={() => setActivePage("ViewInStoreVendor")}
          className={getActiveClass("ViewInStoreVendor")}
        >
          <HiBuildingStorefront size={20} style={{ marginRight: "5px" }} />
          View In Store
        </li>
        {/* Render "Add Product" only if vendor tier is 3 or higher */}
        {/* {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("AddProduct")}
            className={getActiveClass("AddProduct")}
          >
            Add Product
          </li>
        )} */}
        <li
          onClick={() => setActivePage("promotionsPage")}
          className={getActiveClass("promotionsPage")}
        >
          <FaMoneyBill size={20} style={{ marginRight: "5px" }} />
          Promotions
        </li>
        {/* {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("posPage")}
            className={getActiveClass("posPage")}
          >
            <RiFileExcel2Fill size={20} style={{ marginRight: "5px" }} />
            Pos Page
          </li>
        )} */}
        {/* Render "Brand Form" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandForm")}
            className={getActiveClass("BrandForm")}
          >
            <FaWpforms size={20} style={{ marginRight: "5px" }} />
            Brand Form
          </li>
        )}
        {/* Render "Add Employee" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandingPage")}
            className={getActiveClass("BrandingPage")}
          >
            <ImProfile size={20} style={{ marginRight: "5px" }} />
            Brand Profile
          </li>
        )}
        {/* Render "Add Employee" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("Accounting")}
            className={getActiveClass("Accounting")}
          >
            <MdAccountBalance size={20} style={{ marginRight: "5px" }} />
            Accounting
          </li>
        )}
        {/* Render "Add Employee" only if vendor tier is 3 or higher */}
        {/* {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("EmployeeSignup")}
            className={getActiveClass("EmployeeSignup")}
          >
            Add Employee
          </li>
        )} */}

        {/* Render "Employee Page" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("EmployeePage")}
            className={getActiveClass("EmployeePage")}
          >
            <FaUsers size={20} style={{ marginRight: "5px" }} />
            Employees
          </li>
        )}
      </ul>
    </aside>
  );
};

export default SidebarVendor;
