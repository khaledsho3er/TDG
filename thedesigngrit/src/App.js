import React, {
  Suspense,
  lazy,
  useTransition,
  useEffect,
  useState,
} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
import Home from "./Pages/home";

// Safari-compatible lazy loading with retry mechanism
const createSafeLazy = (importFn, componentName) => {
  return lazy(() =>
    importFn().catch((error) => {
      console.warn(`Failed to load ${componentName}, retrying...`, error);
      // Safari-specific retry with delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(importFn());
        }, 100);
      }).catch((retryError) => {
        console.error(
          `Failed to load ${componentName} after retry:`,
          retryError
        );
        // Fallback component
        return {
          default: () => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontFamily: "Montserrat, sans-serif",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <h2>Unable to load {componentName}</h2>
              <p>Please refresh the page or check your connection.</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "12px 24px",
                  marginTop: "16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Refresh Page
              </button>
            </div>
          ),
        };
      });
    })
  );
};

// Enhanced lazy loading with Safari fixes
// Instead of lazy loading Home, import it directly
const LoginPage = createSafeLazy(() => import("./Pages/login"), "LoginPage");
const SignUpPage = createSafeLazy(() => import("./Pages/signup"), "SignUpPage");
const AboutUsPage = createSafeLazy(
  () => import("./Pages/aboutUs"),
  "AboutUsPage"
);
const ContactUs = createSafeLazy(
  () => import("./Pages/ContactUs"),
  "ContactUs"
);
const Vendorspage = createSafeLazy(
  () => import("./Pages/Vendorspage"),
  "Vendorspage"
);
const VendorProfile = createSafeLazy(
  () => import("./Pages/VendorProfile"),
  "VendorProfile"
);
const ShoppingCart = createSafeLazy(
  () => import("./Pages/ShoppingCart"),
  "ShoppingCart"
);
const CheckoutPage = createSafeLazy(
  () => import("./Pages/Checkout"),
  "CheckoutPage"
);
const CareersPage = createSafeLazy(
  () => import("./Pages/careers"),
  "CareersPage"
);
const FAQs = createSafeLazy(() => import("./Pages/FAQs"), "FAQs");
const TrackOrder = createSafeLazy(
  () => import("./Pages/TrackOrder"),
  "TrackOrder"
);
const MyAccount = createSafeLazy(
  () => import("./Pages/myAccount"),
  "MyAccount"
);
const UserProfile = createSafeLazy(
  () => import("./Pages/userss"),
  "UserProfile"
);
const ProductPage = createSafeLazy(
  () => import("./Pages/ProductPage"),
  "ProductPage"
);
const ProductsPage = createSafeLazy(
  () => import("./Pages/ProductsPage"),
  "ProductsPage"
);
const Subcategories = createSafeLazy(
  () => import("./Pages/subcategories"),
  "Subcategories"
);
const TypesPage = createSafeLazy(() => import("./Pages/types"), "TypesPage");
const TermsOfService = createSafeLazy(
  () => import("./Pages/Policy"),
  "TermsOfService"
);
const JobDesc = createSafeLazy(
  () => import("./Pages/JobDescription"),
  "JobDescription"
);
const PartnersApplication = createSafeLazy(
  () => import("./Pages/Partners"),
  "PartnersApplication"
);
const AdminLogin = createSafeLazy(
  () => import("./Components/adminSide/AdminLogin"),
  "AdminLogin"
);
const PrivateRouteAdmin = createSafeLazy(
  () => import("./utils/PrivateRouteAdmin"),
  "PrivateRouteAdmin"
);

// Vendor routes with Safari-compatible lazy loading
const VendorHome = createSafeLazy(
  () => import("./Pages/vendorSide/VendorHome"),
  "VendorHome"
);
const OrderDetails = createSafeLazy(
  () => import("./Components/vendorSide/orderDetails"),
  "OrderDetails"
);
const UpdateProductForm = createSafeLazy(
  () => import("./Components/vendorSide/UpdateProduct"),
  "UpdateProductForm"
);
const AdminHome = createSafeLazy(
  () => import("./Pages/vendorSide/AdminHome"),
  "AdminHome"
);
const NotificationsPage = createSafeLazy(
  () => import("./Components/vendorSide/notificationPage"),
  "NotificationsPage"
);
const SigninVendor = createSafeLazy(
  () => import("./Components/vendorSide/signinVendor"),
  "SigninVendor"
);
const EditEmployee = createSafeLazy(
  () => import("./Components/vendorSide/editEmployee"),
  "EditEmployee"
);
const BrandForm = createSafeLazy(
  () => import("./Components/vendorSide/addbrand"),
  "BrandForm"
);
const SignupVendor = createSafeLazy(
  () => import("./Components/vendorSide/SignupVendor"),
  "SignupVendor"
);
const VerifyPartners = createSafeLazy(
  () => import("./Components/adminSide/VerifyPartners"),
  "VerifyPartners"
);

// Enhanced loading screen with transition support
const TransitionAwareLoadingScreen = () => {
  const [isPending] = useTransition();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setShowFallback(true);
  }, []);

  if (!showFallback && !isPending) return null;

  return <LoadingScreen />;
};

// Safari-specific navigation wrapper
const SafariNavigationWrapper = ({ children }) => {
  const [startTransition] = useTransition();

  useEffect(() => {
    // Handle Safari's bfcache (back-forward cache) issues
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Safari sometimes needs a nudge when returning to the tab
        startTransition(() => {
          // Force a re-render without full reload
          setTimeout(() => {
            // Nudge Safari
          }, 0);
        });
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startTransition]);

  return children;
};

// Route wrapper with transition support
const TransitionRoute = ({ element }) => {
  return (
    <Suspense fallback={<TransitionAwareLoadingScreen />}>{element}</Suspense>
  );
};

// Main routes component
const AppRoutes = () => {
  return (
    <SafariNavigationWrapper>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<TransitionRoute element={<Home />} />} />
        <Route
          path="/login"
          element={<TransitionRoute element={<LoginPage />} />}
        />
        <Route
          path="/signup"
          element={<TransitionRoute element={<SignUpPage />} />}
        />
        <Route
          path="/vendors"
          element={<TransitionRoute element={<Vendorspage />} />}
        />
        <Route
          path="/about"
          element={<TransitionRoute element={<AboutUsPage />} />}
        />
        <Route
          path="/mycart"
          element={<TransitionRoute element={<ShoppingCart />} />}
        />
        <Route
          path="/careers"
          element={<TransitionRoute element={<CareersPage />} />}
        />
        <Route
          path="/contactus"
          element={<TransitionRoute element={<ContactUs />} />}
        />
        <Route
          path="/policy"
          element={<TransitionRoute element={<TermsOfService />} />}
        />
        <Route
          path="/product/:id"
          element={<TransitionRoute element={<ProductPage />} />}
        />
        <Route
          path="/ProductsPage"
          element={<TransitionRoute element={<ProductsPage />} />}
        />
        <Route
          path="/vendor/:id"
          element={<TransitionRoute element={<VendorProfile />} />}
        />
        <Route
          path="/checkout"
          element={<TransitionRoute element={<CheckoutPage />} />}
        />
        <Route
          path="/jobdesc/:jobId"
          element={<TransitionRoute element={<JobDesc />} />}
        />
        <Route
          path="/policy/:section"
          element={<TransitionRoute element={<TermsOfService />} />}
        />
        <Route
          path="/products/:typeId/:typeName"
          element={<TransitionRoute element={<ProductsPage />} />}
        />
        <Route path="/products/readytoship" element={<ReadyToShip />} />
        <Route path="/products/onsale" element={<OnSale />} />
        <Route
          path="/partners"
          element={<TransitionRoute element={<PartnersApplication />} />}
        />
        <Route path="/faqs" element={<TransitionRoute element={<FAQs />} />} />
        <Route
          path="/trackorder"
          element={<TransitionRoute element={<TrackOrder />} />}
        />
        <Route
          path="/myaccount"
          element={<TransitionRoute element={<MyAccount />} />}
        />
        <Route
          path="/usersss"
          element={<TransitionRoute element={<UserProfile />} />}
        />
        <Route
          path="/category/:categoryId/subcategories"
          element={<TransitionRoute element={<Subcategories />} />}
        />
        <Route
          path="/types/:subCategoryId"
          element={<TransitionRoute element={<TypesPage />} />}
        />

        {/* Vendor Routes */}
        <Route
          path="/vendor-dashboard/:vendorId"
          element={<TransitionRoute element={<VendorHome />} />}
        />
        <Route
          path="/orderDetail/:id"
          element={<TransitionRoute element={<OrderDetails />} />}
        />
        <Route
          path="/update-product"
          element={<TransitionRoute element={<UpdateProductForm />} />}
        />
        <Route
          path="/admin-login"
          element={<TransitionRoute element={<AdminLogin />} />}
        />
        <Route
          path="/adminpanel"
          element={
            <TransitionRoute
              element={
                <PrivateRouteAdmin>
                  <AdminHome />
                </PrivateRouteAdmin>
              }
            />
          }
        />
        <Route
          path="/verify-partner"
          element={<TransitionRoute element={<VerifyPartners />} />}
        />
        <Route
          path="/notifications"
          element={<TransitionRoute element={<NotificationsPage />} />}
        />
        <Route
          path="/signin-vendor"
          element={<TransitionRoute element={<SigninVendor />} />}
        />
        <Route
          path="/signupvendor"
          element={<TransitionRoute element={<SignupVendor />} />}
        />
        <Route
          path="/addbrand"
          element={<TransitionRoute element={<BrandForm />} />}
        />
        <Route
          path="/edit-employee/:id"
          element={<TransitionRoute element={<EditEmployee />} />}
        />
      </Routes>
    </SafariNavigationWrapper>
  );
};

function App() {
  useEffect(() => {
    // Safari-specific initialization
    if (typeof window !== "undefined") {
      // Prevent Safari from caching dynamic imports
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.update();
          });
        });
      }

      // Handle Safari's module loading issues
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      if (isSafari) {
        // Force Safari to handle dynamic imports properly
        window.addEventListener("beforeunload", () => {
          // Clear any pending module loads
          if (window.__webpack_require__) {
            window.__webpack_require__.cache = {};
          }
        });
      }
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <VendorProvider>
          <AdminProvider>
            <CartProvider>
              <FavoritesProvider>
                <Router>
                  <ScrollToTop />
                  <AppRoutes />
                  <Analytics />
                </Router>
              </FavoritesProvider>
            </CartProvider>
          </AdminProvider>
        </VendorProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
