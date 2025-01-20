import React, { useState, useContext } from "react";
import NavbarVendor from "../../Components/vendorSide/navbarVendor";
import DashboardVendor from "../../Components/vendorSide/DashboardVendor";
import SidebarEmployee from "./sidebarEmplyee";
import ProductsPageVendor from "../../Components/vendorSide/productsPageVendor";
import RecentPurchases from "../../Components/vendorSide/orderListVendor";
// import ProductForm from "../../Components/vendorSide/AddProduct";
import BrandSignup from "../../Components/vendorSide/brandSignup";
import AddProduct from "../../Components/vendorSide/postProduct";
import BrandingPage from "../../Components/vendorSide/brandingPage";
import EmployeeSignup from "../../Components/vendorSide/Addemployee";
import EmployeePage from "../../Components/vendorSide/employeePage";
import { UserContext } from "../../utils/userContext"; // Assuming you have UserContext to manage user data
import AccountingPage from "../../Components/vendorSide/Accounting";
// import { useParams } from "react-router-dom";
// import axios from "axios";

const EmployeeHome = () => {
  const { user } = useContext(UserContext); // Access user data from context

  const [activePage, setActivePage] = useState("dashboard");
  // const { vendorId } = useParams(); // Get vendor ID from URL
  // const [vendor, setVendor] = useState(null);

  // // Fetch vendor details using vendorId from the URL
  // useEffect(() => {
  //   const fetchVendorDetails = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/api/vendor/${vendorId}`
  //       );
  //       setVendor(response.data);
  //     } catch (error) {
  //       console.error("Error fetching vendor details:", error);
  //     }
  //   };

  //   fetchVendorDetails();
  // }, [vendorId]);

  // if (!vendor) return <div className="loader">Loading vendor details...</div>;

  // Object for rendering content based on active page
  const pageComponents = {
    dashboard: <DashboardVendor />,
    allProducts: <ProductsPageVendor />,
    orderList: <RecentPurchases />,
    AddProduct: <AddProduct />,
    BrandForm: <BrandSignup />,
    BrandingPage: <BrandingPage />,
    Accounting: <AccountingPage />,
    EmployeeSignup: <EmployeeSignup />,
    EmployeePage: <EmployeePage />,
  };

  // Function to render content based on active page
  const renderContent = () => {
    return pageComponents[activePage] || <DashboardVendor />;
  };

  return (
    <div className="app-container-vendor">
      <NavbarVendor />
      <div className="main-content-vendor">
        <SidebarEmployee
          setActivePage={setActivePage}
          activePage={activePage}
          user={user} // The user object should contain role and tier information
        />
        <div className="content-vendor">{renderContent()}</div>
      </div>
    </div>
  );
};

export default EmployeeHome;
