import React, { useState } from "react";
import NavbarVendor from "../../Components/vendorSide/navbarVendor";
import SidebarVendor from "../../Components/vendorSide/sideBarVendor";
import DashboardVendor from "../../Components/vendorSide/DashboardVendor";
import ProductsPageVendor from "../../Components/vendorSide/productsPageVendor";
import RecentPurchases from "../../Components/vendorSide/orderListVendor";
import ProductForm from "../../Components/vendorSide/AddProduct";
const VendorHome = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardVendor />;
      case "allProducts":
        return <ProductsPageVendor />;
      case "orderList":
        return <RecentPurchases />;
      case "ProductForm":
        return <ProductForm />;
      default:
        return "DashboardVendor";
    }
  };

  return (
    <div className="app-container-vendor">
      <NavbarVendor />
      <div className="main-content-vendor">
        <SidebarVendor setActivePage={setActivePage} />
        <div className="content-vendor">{renderContent()}</div>
      </div>
    </div>
  );
};

export default VendorHome;
