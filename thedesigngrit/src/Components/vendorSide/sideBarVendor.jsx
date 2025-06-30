import React, { useEffect, useState } from "react";
import { useVendor } from "../../utils/vendorContext";
import axios from "axios";
import { RiDashboard3Fill } from "react-icons/ri";
import { LuPackageOpen } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { FaMoneyBill } from "react-icons/fa6";
import { HiBuildingStorefront } from "react-icons/hi2";
import { MdAccountBalance } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { FaWpforms, FaBell, FaUsers } from "react-icons/fa";
import LoadingScreen from "../../Pages/loadingScreen";

// import { RiFileExcel2Fill } from "react-icons/ri";

const SidebarVendor = ({ setActivePage, activePage }) => {
  const { vendor } = useVendor();
  const [isVendorLoaded, setIsVendorLoaded] = useState(false);
  const [brandStatus, setBrandStatus] = useState(null);

  useEffect(() => {
    const checkVendorAndBrand = async () => {
      if (vendor) {
        setIsVendorLoaded(true);

        // Check brand status if vendor has a brandId
        if (vendor.brandId) {
          try {
            const response = await axios.get(
              `https://api.thedesigngrit.com/api/brand/${vendor.brandId}`
            );
            setBrandStatus(response.data.status);
          } catch (error) {
            console.error("Error checking brand status:", error);
          }
        }
      } else {
        // Fallback: Check if vendor data is available in localStorage
        const storedVendor = JSON.parse(localStorage.getItem("vendor"));
        if (storedVendor) {
          setIsVendorLoaded(true);

          // Check brand status if stored vendor has a brandId
          if (storedVendor.brandId) {
            try {
              const response = await axios.get(
                `https://api.thedesigngrit.com/api/brand/${storedVendor.brandId}`
              );
              setBrandStatus(response.data.status);
            } catch (error) {
              console.error("Error checking brand status:", error);
            }
          }
        }
      }
    };

    checkVendorAndBrand();
  }, [vendor]);

  // Function to handle active page highlighting
  const getActiveClass = (page) => {
    return activePage === page
      ? "sidebar-item-vendor active"
      : "sidebar-item-vendor";
  };

  // Return a loading spinner or message until vendor data is loaded
  if (!isVendorLoaded) {
    return <LoadingScreen />;
  }

  // If brand is deactivated, don't render the sidebar
  if (brandStatus === "deactivated") {
    return null;
  }

  return (
    <aside className="sidebar-vendor">
      <ul className="sidebar-menu-vendor">
        <li
          onClick={() => setActivePage("dashboard")}
          className={getActiveClass("dashboard")}
        >
          <span className="sidebar-item-content">
            <RiDashboard3Fill className="sidebar-item-icon" />
            <span className="sidebar-item-text">Dashboard</span>
          </span>
        </li>
        <li
          onClick={() => setActivePage("notifications")}
          className={getActiveClass("notifications")}
        >
          <span className="sidebar-item-content">
            <FaBell className="sidebar-item-icon" />
            <span className="sidebar-item-text">Notifications</span>
          </span>
        </li>
        <li
          onClick={() => setActivePage("allProducts")}
          className={getActiveClass("allProducts")}
        >
          <span className="sidebar-item-content">
            <LuPackageOpen className="sidebar-item-icon" />
            <span className="sidebar-item-text">All Products</span>
          </span>
        </li>
        <li
          onClick={() => setActivePage("orderList")}
          className={getActiveClass("orderList")}
        >
          <span className="sidebar-item-content">
            <TbTruckDelivery className="sidebar-item-icon" />
            <span className="sidebar-item-text">Order List</span>
          </span>
        </li>
        <li
          onClick={() => setActivePage("quotationsList")}
          className={getActiveClass("quotationsList")}
        >
          <span className="sidebar-item-content">
            <FaMoneyBill className="sidebar-item-icon" />
            <span className="sidebar-item-text">Quotation List</span>
          </span>
        </li>
        <li
          onClick={() => setActivePage("ViewInStoreVendor")}
          className={getActiveClass("ViewInStoreVendor")}
        >
          <span className="sidebar-item-content">
            <HiBuildingStorefront className="sidebar-item-icon" />
            <span className="sidebar-item-text">View In Store</span>
          </span>
        </li>
        <li
          onClick={() => setActivePage("promotionsPage")}
          className={getActiveClass("promotionsPage")}
        >
          <span className="sidebar-item-content">
            <FaMoneyBill className="sidebar-item-icon" />
            <span className="sidebar-item-text">Promotions</span>
          </span>
        </li>
        {/* Render "Brand Form" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandForm")}
            className={getActiveClass("BrandForm")}
          >
            <span className="sidebar-item-content">
              <FaWpforms className="sidebar-item-icon" />
              <span className="sidebar-item-text">Brand Form</span>
            </span>
          </li>
        )}
        {/* Render "Add Employee" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandingPage")}
            className={getActiveClass("BrandingPage")}
          >
            <span className="sidebar-item-content">
              <ImProfile className="sidebar-item-icon" />
              <span className="sidebar-item-text">Brand Profile</span>
            </span>
          </li>
        )}
        {/* Render "Add Employee" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("Accounting")}
            className={getActiveClass("Accounting")}
          >
            <span className="sidebar-item-content">
              <MdAccountBalance className="sidebar-item-icon" />
              <span className="sidebar-item-text">Accounting</span>
            </span>
          </li>
        )}
        {/* Render "Employee Page" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("EmployeePage")}
            className={getActiveClass("EmployeePage")}
          >
            <span className="sidebar-item-content">
              <FaUsers className="sidebar-item-icon" />
              <span className="sidebar-item-text">Employees</span>
            </span>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default SidebarVendor;
