import React, { useState } from "react";
import NavbarVendor from "../../Components/vendorSide/navbarVendor";
import SidebarVendor from "../../Components/vendorSide/sideBarVendor";
import DashboardVendor from "../../Components/vendorSide/DashboardVendor";
import ProductsPageVendor from "../../Components/vendorSide/productsPageVendor";
import RecentPurchases from "../../Components/vendorSide/orderListVendor";
// import ProductForm from "../../Components/vendorSide/AddProduct";
import BrandSignup from "../../Components/vendorSide/brandSignup";
import AddProduct from "../../Components/vendorSide/postProduct";
import BrandingPage from "../../Components/vendorSide/brandingPage";
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
      case "AddProduct":
        return <AddProduct />;
      case "BrandForm":
        return <BrandSignup />;
      case "BrandingPage":
        return <BrandingPage />;
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
