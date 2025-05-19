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
    return <div>Loading...</div>;
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

        <li
          onClick={() => setActivePage("promotionsPage")}
          className={getActiveClass("promotionsPage")}
        >
          <FaMoneyBill size={20} style={{ marginRight: "5px" }} />
          Promotions
        </li>

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
