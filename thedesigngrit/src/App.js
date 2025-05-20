import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "./Context/cartcontext";
import { UserProvider } from "./utils/userContext";
import { VendorProvider } from "./utils/vendorContext";
import ScrollToTop from "./Context/scrollToTop";
import { Analytics } from "@vercel/analytics/react";
import LoadingScreen from "./Pages/loadingScreen";
import ReadyToShip from "./Pages/ReadyToship";
import { AdminProvider } from "./utils/adminContext";
import OnSale from "./Pages/onSale";
import { FavoritesProvider } from "./Components/favoriteOverlay";
import ErrorBoundary from "./Components/ErrorBoundary";
import { CircularProgress, Box } from "@mui/material";
import NetworkDetector from "./Components/NetworkDetector";

// Custom loading component with retry
const PageLoadingFallback = ({ error, retry }) => {
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          p: 3,
        }}
      >
        <h2>Failed to load page</h2>
        <p>{error.message}</p>
        <button
          onClick={retry}
          style={{
            padding: "10px 20px",
            background: "#6b7b58",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Retry
        </button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

// Enhanced lazy loading with retry - without using hooks
const lazyWithRetry = (componentImport) => {
  return lazy(() =>
    componentImport().catch((error) => {
      console.error("Error loading component:", error);
      // Return a component that displays the error and provides a retry button
      return {
        default: (props) => (
          <PageLoadingFallback
            error={error}
            retry={() => window.location.reload()}
            {...props}
          />
        ),
      };
    })
  );
};

// Lazy Load Pages with enhanced error handling
const Home = lazyWithRetry(() => import("./Pages/home"));
const LoginPage = lazyWithRetry(() => import("./Pages/login"));
const SignUpPage = lazyWithRetry(() => import("./Pages/signup"));
const AboutUsPage = lazyWithRetry(() => import("./Pages/aboutUs"));
const ContactUs = lazyWithRetry(() => import("./Pages/ContactUs"));
const Vendorspage = lazyWithRetry(() => import("./Pages/Vendorspage"));
const VendorProfile = lazyWithRetry(() => import("./Pages/VendorProfile"));
const ShoppingCart = lazyWithRetry(() => import("./Pages/ShoppingCart"));
const CheckoutPage = lazyWithRetry(() => import("./Pages/Checkout"));
const CareersPage = lazyWithRetry(() => import("./Pages/careers"));
const FAQs = lazyWithRetry(() => import("./Pages/FAQs"));
const TrackOrder = lazyWithRetry(() => import("./Pages/TrackOrder"));
const MyAccount = lazyWithRetry(() => import("./Pages/myAccount"));
const UserProfile = lazyWithRetry(() => import("./Pages/userss"));
const ProductPage = lazyWithRetry(() => import("./Pages/ProductPage"));
const ProductsPage = lazyWithRetry(() => import("./Pages/ProductsPage"));
const Subcategories = lazyWithRetry(() => import("./Pages/subcategories"));
const TypesPage = lazyWithRetry(() => import("./Pages/types"));
const TermsOfService = lazyWithRetry(() => import("./Pages/Policy"));
const JobDesc = lazyWithRetry(() => import("./Pages/JobDescription"));
const PartnersApplication = lazyWithRetry(() => import("./Pages/Partners"));
const AdminLogin = lazyWithRetry(() =>
  import("./Components/adminSide/AdminLogin")
);
const PrivateRouteAdmin = lazyWithRetry(() =>
  import("./utils/PrivateRouteAdmin")
);
// Lazy Load Pages (Vendor)
const VendorHome = lazyWithRetry(() => import("./Pages/vendorSide/VendorHome"));
const OrderDetails = lazyWithRetry(() =>
  import("./Components/vendorSide/orderDetails")
);
const UpdateProductForm = lazyWithRetry(() =>
  import("./Components/vendorSide/UpdateProduct")
);
const AdminHome = lazyWithRetry(() => import("./Pages/vendorSide/AdminHome"));
const NotificationsPage = lazyWithRetry(() =>
  import("./Components/vendorSide/notificationPage")
);
const SigninVendor = lazyWithRetry(() =>
  import("./Components/vendorSide/signinVendor")
);
const EditEmployee = lazyWithRetry(() =>
  import("./Components/vendorSide/editEmployee")
);
const BrandForm = lazyWithRetry(() =>
  import("./Components/vendorSide/addbrand")
);
const SignupVendor = lazyWithRetry(() =>
  import("./Components/vendorSide/SignupVendor")
);
const VerifyPartners = lazyWithRetry(() =>
  import("./Components/adminSide/VerifyPartners")
);

const PublicRoutes = () => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/vendors" element={<Vendorspage />} />
        <Route exact path="/about" element={<AboutUsPage />} />
        <Route exact path="/mycart" element={<ShoppingCart />} />
        <Route exact path="/careers" element={<CareersPage />} />
        <Route exact path="/contactus" element={<ContactUs />} />
        <Route path="/policy" element={<TermsOfService />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route exact path="/ProductsPage" element={<ProductsPage />} />
        <Route exact path="/vendor/:id" element={<VendorProfile />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/jobdesc/:jobId" element={<JobDesc />} />
        <Route path="/policy/:section" element={<TermsOfService />} />
        <Route path="/products/:typeId/:typeName" element={<ProductsPage />} />
        <Route path="/products/readytoship" element={<ReadyToShip />} />
        <Route path="/products/onsale" element={<OnSale />} />
        <Route exact path="/partners" element={<PartnersApplication />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/trackorder" element={<TrackOrder />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/usersss" element={<UserProfile />} />
        <Route
          path="/category/:categoryId/subcategories"
          element={<Subcategories />}
        />
        <Route path="/types/:subCategoryId" element={<TypesPage />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
);

const VendorRoutes = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      <Route path="/vendor-dashboard/:vendorId" element={<VendorHome />} />
      <Route path="/orderDetail/:id" element={<OrderDetails />} />
      <Route path="/update-product" element={<UpdateProductForm />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/adminpanel"
        element={
          <PrivateRouteAdmin>
            <AdminHome />
          </PrivateRouteAdmin>
        }
      />{" "}
      <Route path="/verify-partner" element={<VerifyPartners />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/signin-vendor" element={<SigninVendor />} />
      <Route path="/signupvendor" element={<SignupVendor />} />
      <Route path="/addbrand" element={<BrandForm />} />
      <Route path="/edit-employee/:id" element={<EditEmployee />} />
    </Routes>
  </Suspense>
);

function App() {
  return (
    <UserProvider>
      <VendorProvider>
        <AdminProvider>
          <CartProvider>
            <FavoritesProvider>
              <Router>
                <NetworkDetector>
                  <ScrollToTop />
                  <ErrorBoundary>
                    <PublicRoutes />
                    <VendorRoutes />
                    <Analytics />
                  </ErrorBoundary>
                </NetworkDetector>
              </Router>
            </FavoritesProvider>
          </CartProvider>
        </AdminProvider>
      </VendorProvider>
    </UserProvider>
  );
}

export default App;
