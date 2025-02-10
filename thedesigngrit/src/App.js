import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { CartProvider } from "./Context/cartcontext";
import { UserProvider } from "./utils/userContext";
import { VendorProvider } from "./utils/vendorContext";
import ScrollToTop from "./Context/scrollToTop";
import LoadingScreen from "./Pages/loadingScreen";
const Home = React.lazy(() => import("./Pages/home"));
const LoginPage = React.lazy(() => import("./Pages/login"));
const SignUpPage = React.lazy(() => import("./Pages/signup"));
const AboutUsPage = React.lazy(() => import("./Pages/aboutUs"));
const JobDesc = React.lazy(() => import("./Pages/JobDescription"));
const TermsOfService = React.lazy(() => import("./Pages/Policy"));
const PartnersApplication = React.lazy(() => import("./Pages/Partners"));
const ContactUs = React.lazy(() => import("./Pages/ContactUs"));
const ProductsPage = React.lazy(() => import("./Pages/ProductsPage"));
const ProductPage = React.lazy(() => import("./Pages/ProductPage"));
const Vendorspage = React.lazy(() => import("./Pages/Vendorspage"));
const VendorProfile = React.lazy(() => import("./Pages/VendorProfile"));
const ShoppingCart = React.lazy(() => import("./Pages/ShoppingCart"));
const CheckoutPage = React.lazy(() => import("./Pages/Checkout"));
const careersPage = React.lazy(() => import("./Pages/careers"));
const FAQs = React.lazy(() => import("./Pages/FAQs"));
const TrackOrder = React.lazy(() => import("./Pages/TrackOrder"));
const MyAccount = React.lazy(() => import("./Pages/myAccount"));
const UserProfile = React.lazy(() => import("./Pages/userss"));
const VendorHome = React.lazy(() => import("./Pages/vendorSide/VendorHome"));
const OrderDetails = React.lazy(() => import("./Components/vendorSide/orderDetails"));
const UpdateProductForm = React.lazy(() => import("./Components/vendorSide/UpdateProduct"));
const AdminHome = React.lazy(() => import("./Pages/vendorSide/AdminHome"));
const VerifyPartners = React.lazy(() => import("./Components/adminSide/VerifyPartners"));
const NotificationsPage = React.lazy(() => import("./Components/vendorSide/notificationPage"));
const SigninVendor = React.lazy(() => import("./Components/vendorSide/signinVendor"));
const EditEmployee = React.lazy(() => import("./Components/vendorSide/editEmployee"));
const BrandForm = React.lazy(() => import("./Components/vendorSide/addbrand"));
const Subcategories = React.lazy(() => import("./Pages/subcategories"));
const Signupvendor = React.lazy(() => import("./Components/vendorSide/SignupVendor"));




function App() {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
      <UserProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route exact path="/" Component={Home} />
              <Route exact path="/home" Component={Home} />
              <Route exact path="/login" Component={LoginPage} />
              <Route exact path="/signup" Component={SignUpPage} />
              <Route exact path="/Vendors" Component={Vendorspage} />
              <Route exact path="/about" Component={AboutUsPage} />
              <Route path="/jobdesc/:jobId" element={<JobDesc />} />
              <Route path="/policy" element={<TermsOfService />} />
              <Route path="/loading" element={<LoadingScreen />} />
              {/* Add individual routes for policy sections */}
              {/* Example: */}
              <Route
                path="/policy/:section"
                element={<TermsOfService />}
              />{" "}
              <Route
                path="/products/:subcategoryId/:subcategoryName"
                element={<ProductsPage />}
              />
              <Route exact path="/partners" Component={PartnersApplication} />
              <Route exact path="/contactus" Component={ContactUs} />
              <Route exact path="/mycart" Component={ShoppingCart} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route exact path="/ProductsPage" Component={ProductsPage} />
              {/* <Route exact path="/Vendors" Component={Vendorspage} /> */}
              <Route exact path="/Vendorprofile" Component={VendorProfile} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route exact path="/careers" Component={careersPage} />
              <Route path="/faqs" Component={FAQs} />
              <Route path="/trackorder" Component={TrackOrder} />
              <Route path="/myaccount" Component={MyAccount} />
              <Route path="/usersss" Component={UserProfile} />
              {/* <Route path="/vendors" element={<Vendorspage />} /> */}
              <Route path="/vendor/:id" element={<VendorProfile />} />
              {/* Route for the vendors grid */}
              <Route path="/vendors" element={<Vendorspage />} />
              <Route path="/addbrand" Component={BrandForm} />
              <Route path="/edit-employee/:id" component={EditEmployee} />
              <Route path="/update-product" element={<UpdateProductForm />} />
              <Route path="/adminpanel" Component={AdminHome} />
              <Route path="/verify-partner" element={<VerifyPartners />} />
              <Route
                path="/category/:categoryId/subcategories"
                element={<Subcategories />}
              />
            </Routes>
          </Router>
        </CartProvider>
      </UserProvider>
      </Suspense>
      <VendorProvider>
        <Router>
          <Routes>
            <Route path="/signin-vendor" element={<SigninVendor />} />
            <Route path="/signupvendor" element={<Signupvendor />} />
            <Route
              path="/vendor-dashboard/:vendorId"
              element={<VendorHome />}
            />
            <Route path="/orderDetail/:id" element={<OrderDetails />} />
            <Route path="/notificationspage" element={<NotificationsPage />} />
          </Routes>
        </Router>
      </VendorProvider>
      
    </>
  );
}

export default App;
