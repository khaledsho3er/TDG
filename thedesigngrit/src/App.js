import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/home";
import LoginPage from "./Pages/login";
import SignUpPage from "./Pages/signup";
import AboutUsPage from "./Pages/aboutUs";
import JobDesc from "./Pages/JobDescription";
import TermsOfService from "./Pages/Policy";
import PartnersApplication from "./Pages/Partners";
import ContactUs from "./Pages/ContactUs";
import ProductsPage from "./Pages/ProductsPage";
import ProductPage from "./Pages/ProductPage";
import Vendorspage from "./Pages/Vendorspage";
// import PageDescription from "./Components/Topheader";
import VendorProfile from "./Pages/VendorProfile";
import ShoppingCart from "./Pages/ShoppingCart";
import CheckoutPage from "./Pages/Checkout";
import careersPage from "./Pages/careers";
import FAQs from "./Pages/FAQs";
import TrackOrder from "./Pages/TrackOrder";
import { CartProvider } from "./Context/cartcontext";
import MyAccount from "./Pages/myAccount";
import { UserProvider } from "./utils/userContext"; // Import UserProvider
import UserProfile from "./Pages/userss";
import VendorHome from "./Pages/vendorSide/VendorHome";
import OrderDetails from "./Components/vendorSide/orderDetails";
import UpdateProductForm from "./Components/vendorSide/UpdateProduct";
import AdminHome from "./Pages/vendorSide/AdminHome";
import VerifyPartners from "./Components/adminSide/VerifyPartners";
import NotificationsPage from "./Components/vendorSide/notificationPage";
import ScrollToTop from "./Context/scrollToTop";
import SigninVendor from "./Components/vendorSide/signinVendor";
import EditEmployee from "./Components/vendorSide/editEmployee";
import EmployeeHome from "./Components/vendorSide/employeeDashboard";
import BrandForm from "./Components/vendorSide/addbrand";
import { VendorProvider } from "./utils/vendorContext";
import Subcategories from "./Pages/subcategories";
// import Signupvendor from "./Components/vendorSide/SignupVendor";

function App() {
  return (
    <>
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
              {/* Add individual routes for policy sections */}
              {/* Example: */}
              <Route
                path="/policy/:section"
                element={<TermsOfService />}
              />{" "}
              <Route exact path="/partners" Component={PartnersApplication} />
              <Route exact path="/contactus" Component={ContactUs} />
              <Route exact path="/mycart" Component={ShoppingCart} />
              <Route
                path="/category/:categoryId/:categoryName"
                element={<ProductsPage />}
              />
              <Route
                path="/products/:subcategoryId/:subcategoryName"
                element={<ProductsPage />}
              />
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
              <Route path="/orderDetail/:id" element={<OrderDetails />} />
              <Route path="/update-product" element={<UpdateProductForm />} />
              <Route
                path="/notificationspage"
                element={<NotificationsPage />}
              />
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

      <VendorProvider>
        <Router>
          <Routes>
            <Route path="/signin-vendor" element={<SigninVendor />} />
            {/* <Route path="/signupvendor" element={<Signupvendor />} /> */}
            <Route
              path="/vendor-dashboard/:vendorId"
              element={<VendorHome />}
            />
          </Routes>
        </Router>
      </VendorProvider>
    </>
  );
}

export default App;
