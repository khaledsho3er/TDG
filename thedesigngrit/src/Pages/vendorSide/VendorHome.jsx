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
import EmployeeSignup from "../../Components/vendorSide/Addemployee";
import EmployeePage from "../../Components/vendorSide/employeePage";
import AccountingPage from "../../Components/vendorSide/Accounting";
import { useVendor } from "../../utils/vendorContext";
import OrderDetails from "../../Components/vendorSide/orderDetails";
import QuotationsPage from "../../Components/vendorSide/quotationsList";
import NotificationsPage from "../../Components/vendorSide/notificationPage";
import ViewInStoreVendor from "../../Components/vendorSide/viewInStoreVendor";
// import { useParams } from "react-router-dom";
// import axios from "axios";

const VendorHome = () => {
  const { vendor } = useVendor(); // Access vendor data from context
  console.log("vendor in VendorHome:", vendor);
  const [activePage, setActivePage] = useState("dashboard");

  // Object for rendering content based on activepage
  const pageComponents = {
    dashboard: <DashboardVendor />,
    allProducts: <ProductsPageVendor setActivePage={setActivePage} />,
    orderList: <RecentPurchases />,
    quotationsList: <QuotationsPage />,
    OrderDetails: <OrderDetails />,
    AddProduct: <AddProduct />,
    BrandForm: <BrandSignup />,
    BrandingPage: <BrandingPage />,
    Accounting: <AccountingPage />,
    EmployeeSignup: <EmployeeSignup />,
    EmployeePage: <EmployeePage />,
    notifications: <NotificationsPage />,
    ViewInStoreVendor: <ViewInStoreVendor />,
  };

  // Function to render content based on active page
  const renderContent = () => {
    return pageComponents[activePage] || <DashboardVendor />;
  };

  return (
    <div className="app-container-vendor">
      <NavbarVendor />
      <div className="main-content-vendor">
        <SidebarVendor
          setActivePage={setActivePage}
          activePage={activePage}
          user={vendor} // The user object should contain role and tier information
        />
        <div className="content-vendor">{renderContent()}</div>
        {/* <div className="content-vendor">
          {renderContent()}
          <NotificationsPage setActivePage={setActivePage} />
        </div> */}
      </div>
    </div>
  );
};

export default VendorHome;
