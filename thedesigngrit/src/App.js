import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./Context/cartcontext";
import { UserProvider } from "./utils/userContext";
import { VendorProvider } from "./utils/vendorContext";
import ScrollToTop from "./Context/scrollToTop";
import { Analytics } from "@vercel/analytics/react";
import LoadingScreen from "./Pages/loadingScreen";

// Lazy Load Pages (Public)
const Home = lazy(() => import("./Pages/home"));
const LoginPage = lazy(() => import("./Pages/login"));
const SignUpPage = lazy(() => import("./Pages/signup"));
const AboutUsPage = lazy(() => import("./Pages/aboutUs"));
const ContactUs = lazy(() => import("./Pages/ContactUs"));
const Vendorspage = lazy(() => import("./Pages/Vendorspage"));
const VendorProfile = lazy(() => import("./Pages/VendorProfile"));
const ShoppingCart = lazy(() => import("./Pages/ShoppingCart"));
const CheckoutPage = lazy(() => import("./Pages/Checkout"));
const CareersPage = lazy(() => import("./Pages/careers"));
const FAQs = lazy(() => import("./Pages/FAQs"));
const TrackOrder = lazy(() => import("./Pages/TrackOrder"));
const MyAccount = lazy(() => import("./Pages/myAccount"));
const UserProfile = lazy(() => import("./Pages/userss"));
const ProductPage = lazy(() => import("./Pages/ProductPage"));
const ProductsPage = lazy(() => import("./Pages/ProductsPage"));
const Subcategories = lazy(() => import("./Pages/subcategories"));
const TypesPage = lazy(() => import("./Pages/types"));
const TermsOfService = lazy(() => import("./Pages/Policy"));
const JobDesc = lazy(() => import("./Pages/JobDescription"));
const PartnersApplication = lazy(() => import("./Pages/Partners"));

// Lazy Load Pages (Vendor)
const VendorHome = lazy(() => import("./Pages/vendorSide/VendorHome"));
const OrderDetails = lazy(() => import("./Components/vendorSide/orderDetails"));
const UpdateProductForm = lazy(() =>
  import("./Components/vendorSide/UpdateProduct")
);
const AdminHome = lazy(() => import("./Pages/vendorSide/AdminHome"));
const NotificationsPage = lazy(() =>
  import("./Components/vendorSide/notificationPage")
);
const SigninVendor = lazy(() => import("./Components/vendorSide/signinVendor"));
const EditEmployee = lazy(() => import("./Components/vendorSide/editEmployee"));
const BrandForm = lazy(() => import("./Components/vendorSide/addbrand"));
const SignupVendor = lazy(() => import("./Components/vendorSide/SignupVendor"));
const VerifyPartners = lazy(() =>
  import("./Components/adminSide/VerifyPartners")
);

const PublicRoutes = () => (
  <Suspense fallback={<LoadingScreen />}>
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
);

const VendorRoutes = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      <Route path="/vendor-dashboard/:vendorId" element={<VendorHome />} />
      <Route path="/orderDetail/:id" element={<OrderDetails />} />
      <Route path="/update-product" element={<UpdateProductForm />} />
      <Route path="/adminpanel" element={<AdminHome />} />
      <Route path="/verify-partner" element={<VerifyPartners />} />
      <Route path="/notificationspage" element={<NotificationsPage />} />
      <Route path="/signin-vendor" element={<SigninVendor />} />
      <Route path="/signupvendor" element={<SignupVendor />} />
      <Route path="/addbrand" element={<BrandForm />} />
      <Route path="/edit-employee/:id" element={<EditEmployee />} />
    </Routes>
  </Suspense>
);
//hi.

function App() {
  return (
    <UserProvider>
      <VendorProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <PublicRoutes />
            <VendorRoutes />
            <Analytics />
          </Router>
        </CartProvider>
      </VendorProvider>
    </UserProvider>
  );
}

export default App;
