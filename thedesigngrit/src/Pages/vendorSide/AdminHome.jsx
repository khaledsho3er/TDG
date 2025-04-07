import React, { useState } from "react";
import NavbarAdmin from "../../Components/adminSide/adminNav";
import SidebarAdmin from "../../Components/adminSide/adminSideBar";
import DashboardAdmin from "../../Components/adminSide/dashboardAdmin";
import RecentPurchasesAdmin from "../../Components/adminSide/orderListAdmin";
import ProductsPageAdmin from "../../Components/adminSide/ProductsAdmin";
import RequestsPartners from "../../Components/adminSide/Requests";
import CategoryForm from "../../Components/adminSide/createCategory";
import CategoryListPage from "../../Components/adminSide/categoriesList";
import TagsTable from "../../Components/adminSide/tags";
import ConceptManager from "../../Components/adminSide/concepts";
const AdminHome = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardAdmin />;
      case "allProducts":
        return <ProductsPageAdmin />;
      case "orderList":
        return <RecentPurchasesAdmin />;
      case "Requests":
        return <RequestsPartners />;
      case "createCategory":
        return <CategoryForm />;
      case "categoriesList":
        return <CategoryListPage />;
      case "tags":
        return <TagsTable />;
      case "concepts":
        return <ConceptManager />;
      default:
        return "DashboardVendor";
    }
  };

  return (
    <div className="app-container-vendor">
      <NavbarAdmin />
      <div className="main-content-vendor">
        <SidebarAdmin setActivePage={setActivePage} />
        <div className="content-vendor">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminHome;
