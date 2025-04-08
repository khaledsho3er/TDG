import React, { useEffect, useState } from "react";
import { useVendor } from "../../utils/vendorContext";
import { RiDashboard3Fill } from "react-icons/ri";
import { LuPackageOpen } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { FaMoneyBill } from "react-icons/fa6";
import { HiBuildingStorefront } from "react-icons/hi2";
import { MdAccountBalance } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { FaWpforms } from "react-icons/fa";

const SidebarVendor = ({ setActivePage, activePage }) => {
  const { vendor } = useVendor();
  const [isVendorLoaded, setIsVendorLoaded] = useState(false);

  useEffect(() => {
    if (vendor) {
      setIsVendorLoaded(true);
    } else {
      const storedVendor = JSON.parse(localStorage.getItem("vendor"));
      if (storedVendor) {
        setIsVendorLoaded(true);
      }
    }
  }, [vendor]);

  const getActiveClass = (page) => {
    return activePage === page
      ? "sidebar-item-vendor active"
      : "sidebar-item-vendor";
  };

  if (!isVendorLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="sidebar-vendor">
      <ul className="sidebar-menu-vendor">
        <li
          onClick={() => setActivePage("dashboard")}
          className={getActiveClass("dashboard")}
        >
          <RiDashboard3Fill size={20} />
          <span className="sidebar-text">Dashboard</span>
        </li>
        <li
          onClick={() => setActivePage("allProducts")}
          className={getActiveClass("allProducts")}
        >
          <LuPackageOpen size={20} />
          <span className="sidebar-text">All Products</span>
        </li>
        <li
          onClick={() => setActivePage("orderList")}
          className={getActiveClass("orderList")}
        >
          <TbTruckDelivery size={20} />
          <span className="sidebar-text">Order List</span>
        </li>
        <li
          onClick={() => setActivePage("quotationsList")}
          className={getActiveClass("quotationsList")}
        >
          <FaMoneyBill size={20} />
          <span className="sidebar-text">Quotation List</span>
        </li>
        <li
          onClick={() => setActivePage("ViewInStoreVendor")}
          className={getActiveClass("ViewInStoreVendor")}
        >
          <HiBuildingStorefront size={20} />
          <span className="sidebar-text">View In Store</span>
        </li>
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandForm")}
            className={getActiveClass("BrandForm")}
          >
            <FaWpforms size={20} />
            <span className="sidebar-text">Brand Form</span>
          </li>
        )}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("BrandingPage")}
            className={getActiveClass("BrandingPage")}
          >
            <ImProfile size={20} />
            <span className="sidebar-text">Brand Profile</span>
          </li>
        )}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("Accounting")}
            className={getActiveClass("Accounting")}
          >
            <MdAccountBalance size={20} />
            <span className="sidebar-text">Accounting</span>
          </li>
        )}
        {vendor?.tier >= 3 && (
          <li
            onClick={() => setActivePage("EmployeePage")}
            className={getActiveClass("EmployeePage")}
          >
            <FaUsers size={20} />
            <span className="sidebar-text">Employees</span>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default SidebarVendor;
