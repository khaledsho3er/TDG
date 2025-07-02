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
import { FaWpforms, FaBell, FaUsers, FaLock } from "react-icons/fa";
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
  const getActiveClass = (page, locked) => {
    let base =
      activePage === page
        ? "sidebar-item-vendor active"
        : "sidebar-item-vendor";
    return locked ? base + " locked" : base;
  };

  // Helper to determine if an item should be locked
  const isLocked = (page) => {
    if (brandStatus === "pending") {
      // Only BrandForm and BrandingPage are open
      return !(page === "BrandForm" || page === "BrandingPage");
    }
    return false;
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
          onClick={() => !isLocked("dashboard") && setActivePage("dashboard")}
          className={getActiveClass("dashboard", isLocked("dashboard"))}
          style={
            isLocked("dashboard") ? { pointerEvents: "none", opacity: 0.5 } : {}
          }
        >
          <span className="sidebar-item-content">
            <RiDashboard3Fill className="sidebar-item-icon" />
            <span className="sidebar-item-text">Dashboard</span>
            {isLocked("dashboard") && <FaLock style={{ marginLeft: 8 }} />}
          </span>
        </li>
        <li
          onClick={() =>
            !isLocked("notifications") && setActivePage("notifications")
          }
          className={getActiveClass("notifications", isLocked("notifications"))}
          style={
            isLocked("notifications")
              ? { pointerEvents: "none", opacity: 0.5 }
              : {}
          }
        >
          <span className="sidebar-item-content">
            <FaBell className="sidebar-item-icon" />
            <span className="sidebar-item-text">Notifications</span>
            {isLocked("notifications") && <FaLock style={{ marginLeft: 8 }} />}
          </span>
        </li>
        <li
          onClick={() =>
            !isLocked("allProducts") && setActivePage("allProducts")
          }
          className={getActiveClass("allProducts", isLocked("allProducts"))}
          style={
            isLocked("allProducts")
              ? { pointerEvents: "none", opacity: 0.5 }
              : {}
          }
        >
          <span className="sidebar-item-content">
            <LuPackageOpen className="sidebar-item-icon" />
            <span className="sidebar-item-text">All Products</span>
            {isLocked("allProducts") && <FaLock style={{ marginLeft: 8 }} />}
          </span>
        </li>
        <li
          onClick={() => !isLocked("orderList") && setActivePage("orderList")}
          className={getActiveClass("orderList", isLocked("orderList"))}
          style={
            isLocked("orderList") ? { pointerEvents: "none", opacity: 0.5 } : {}
          }
        >
          <span className="sidebar-item-content">
            <TbTruckDelivery className="sidebar-item-icon" />
            <span className="sidebar-item-text">Order List</span>
            {isLocked("orderList") && <FaLock style={{ marginLeft: 8 }} />}
          </span>
        </li>
        <li
          onClick={() =>
            !isLocked("quotationsList") && setActivePage("quotationsList")
          }
          className={getActiveClass(
            "quotationsList",
            isLocked("quotationsList")
          )}
          style={
            isLocked("quotationsList")
              ? { pointerEvents: "none", opacity: 0.5 }
              : {}
          }
        >
          <span className="sidebar-item-content">
            <FaMoneyBill className="sidebar-item-icon" />
            <span className="sidebar-item-text">Quotation List</span>
            {isLocked("quotationsList") && <FaLock style={{ marginLeft: 8 }} />}
          </span>
        </li>
        <li
          onClick={() =>
            !isLocked("ViewInStoreVendor") && setActivePage("ViewInStoreVendor")
          }
          className={getActiveClass(
            "ViewInStoreVendor",
            isLocked("ViewInStoreVendor")
          )}
          style={
            isLocked("ViewInStoreVendor")
              ? { pointerEvents: "none", opacity: 0.5 }
              : {}
          }
        >
          <span className="sidebar-item-content">
            <HiBuildingStorefront className="sidebar-item-icon" />
            <span className="sidebar-item-text">View In Store</span>
            {isLocked("ViewInStoreVendor") && (
              <FaLock style={{ marginLeft: 8 }} />
            )}
          </span>
        </li>
        <li
          onClick={() =>
            !isLocked("promotionsPage") && setActivePage("promotionsPage")
          }
          className={getActiveClass(
            "promotionsPage",
            isLocked("promotionsPage")
          )}
          style={
            isLocked("promotionsPage")
              ? { pointerEvents: "none", opacity: 0.5 }
              : {}
          }
        >
          <span className="sidebar-item-content">
            <FaMoneyBill className="sidebar-item-icon" />
            <span className="sidebar-item-text">Promotions</span>
            {isLocked("promotionsPage") && <FaLock style={{ marginLeft: 8 }} />}
          </span>
        </li>
        {/* Render "Brand Form" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandForm")}
            className={getActiveClass("BrandForm", false)}
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
            className={getActiveClass("BrandingPage", false)}
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
            onClick={() =>
              !isLocked("Accounting") && setActivePage("Accounting")
            }
            className={getActiveClass("Accounting", isLocked("Accounting"))}
            style={
              isLocked("Accounting")
                ? { pointerEvents: "none", opacity: 0.5 }
                : {}
            }
          >
            <span className="sidebar-item-content">
              <MdAccountBalance className="sidebar-item-icon" />
              <span className="sidebar-item-text">Accounting</span>
              {isLocked("Accounting") && <FaLock style={{ marginLeft: 8 }} />}
            </span>
          </li>
        )}
        {/* Render "Employee Page" only if vendor tier is 3 or higher */}
        {vendor?.tier >= 3 && (
          <li
            onClick={() =>
              !isLocked("EmployeePage") && setActivePage("EmployeePage")
            }
            className={getActiveClass("EmployeePage", isLocked("EmployeePage"))}
            style={
              isLocked("EmployeePage")
                ? { pointerEvents: "none", opacity: 0.5 }
                : {}
            }
          >
            <span className="sidebar-item-content">
              <FaUsers className="sidebar-item-icon" />
              <span className="sidebar-item-text">Employees</span>
              {isLocked("EmployeePage") && <FaLock style={{ marginLeft: 8 }} />}
            </span>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default SidebarVendor;
