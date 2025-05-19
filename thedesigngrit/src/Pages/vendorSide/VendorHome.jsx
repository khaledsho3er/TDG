import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendor } from "../../utils/vendorContext";
import axios from "axios";
import SidebarVendor from "../../Components/vendorSide/sideBarVendor";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import NavbarVendor from "../../Components/vendorSide/navbarVendor";
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
import OrderDetails from "../../Components/vendorSide/orderDetails";
import QuotationsPage from "../../Components/vendorSide/quotationsList";
import NotificationsPage from "../../Components/vendorSide/notificationPage";
import ViewInStoreVendor from "../../Components/vendorSide/viewInStoreVendor";
import PromotionsPage from "../../Components/vendorSide/PromotionPage";
// import POSPage from "../../Components/vendorSide/PosPage";
// import { useParams } from "react-router-dom";
// import axios from "axios";

const VendorHome = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const { vendor } = useVendor();
  const [brandStatus, setBrandStatus] = useState(null);
  const [showDeactivatedDialog, setShowDeactivatedDialog] = useState(false);

  useEffect(() => {
    const vendorData = localStorage.getItem("vendor");

    if (!vendorData) {
      navigate("/signin-vendor"); // redirect to login page if no vendor found
      return;
    }

    // Check brand status if vendor has a brandId
    const checkBrandStatus = async () => {
      try {
        const parsedVendor = JSON.parse(vendorData);
        if (parsedVendor.brandId) {
          const response = await axios.get(
            `https://api.thedesigngrit.com/api/brand/${parsedVendor.brandId}`
          );

          setBrandStatus(response.data.status);

          // Show dialog if brand is deactivated
          if (response.data.status === "deactivated") {
            setShowDeactivatedDialog(true);
          }
        }
      } catch (error) {
        console.error("Error checking brand status:", error);
      }
    };

    checkBrandStatus();
  }, [navigate, vendor]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("vendor");
    navigate("/vendor-login");
  };

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
    promotionsPage: <PromotionsPage />,
    // posPage: <POSPage />,
  };

  // Function to render content based on active page
  const renderContent = () => {
    // If brand is deactivated, don't render any content
    if (brandStatus === "deactivated") {
      return null;
    }

    return pageComponents[activePage] || <DashboardVendor />;
  };

  return (
    <div className="vendor-home">
      {/* Deactivated Brand Dialog */}
      <Dialog
        open={showDeactivatedDialog}
        onClose={() => {}} // Empty function to prevent closing by clicking outside
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            padding: "24px",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <Box
            sx={{
              bgcolor: "#FFF4F4",
              borderRadius: "50%",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <ErrorOutlineIcon sx={{ color: "#D32F2F", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Account Deactivated
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", mb: 2 }}>
              Your brand account has been deactivated. Please contact the
              administrator team of THE DESIGN GRIT for assistance.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Email: support@thedesigngrit.com
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Phone: +1 (123) 456-7890
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
        >
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              bgcolor: "#D32F2F",
              color: "white",
              textTransform: "none",
              px: 3,
              py: 1,
              "&:hover": {
                bgcolor: "#B71C1C",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Dialog>

      {/* Only render the sidebar and content if brand is not deactivated */}
      {brandStatus !== "deactivated" && (
        <>
          <SidebarVendor
            setActivePage={setActivePage}
            activePage={activePage}
          />
          <div className="vendor-content">{renderContent()}</div>
        </>
      )}
    </div>
  );
};

export default VendorHome;
