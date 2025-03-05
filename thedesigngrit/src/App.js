import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./Context/cartcontext";
import { UserProvider } from "./utils/userContext";
import { VendorProvider } from "./utils/vendorContext";
import ScrollToTop from "./Context/scrollToTop";

// Import Public Pages
import Home from "./Pages/home";
import LoginPage from "./Pages/login";
import SignUpPage from "./Pages/signup";
import AboutUsPage from "./Pages/aboutUs";
import ContactUs from "./Pages/ContactUs";
import Vendorspage from "./Pages/Vendorspage";
import VendorProfile from "./Pages/VendorProfile";
import ShoppingCart from "./Pages/ShoppingCart";
import CheckoutPage from "./Pages/Checkout";
import careersPage from "./Pages/careers";
import FAQs from "./Pages/FAQs";
import TrackOrder from "./Pages/TrackOrder";
import MyAccount from "./Pages/myAccount";
import UserProfile from "./Pages/userss";
import ProductPage from "./Pages/ProductPage";
import ProductsPage from "./Pages/ProductsPage";
import Subcategories from "./Pages/subcategories";
import TypesPage from "./Pages/types";

// Import Vendor Pages
import VendorHome from "./Pages/vendorSide/VendorHome";
import OrderDetails from "./Components/vendorSide/orderDetails";
import UpdateProductForm from "./Components/vendorSide/UpdateProduct";
import AdminHome from "./Pages/vendorSide/AdminHome";
import NotificationsPage from "./Components/vendorSide/notificationPage";
import SigninVendor from "./Components/vendorSide/signinVendor";
import EditEmployee from "./Components/vendorSide/editEmployee";
import BrandForm from "./Components/vendorSide/addbrand";
import Signupvendor from "./Components/vendorSide/SignupVendor";

// Layouts for Separation
const PublicRoutes = () => (
  <Routes>
    <Route exact path="/" element={<Home />} />
    <Route exact path="/home" element={<Home />} />
    <Route exact path="/login" element={<LoginPage />} />
    <Route exact path="/signup" element={<SignUpPage />} />
    <Route exact path="/vendors" element={<Vendorspage />} />
    <Route exact path="/about" element={<AboutUsPage />} />
    <Route exact path="/contactus" element={<ContactUs />} />
    <Route path="/product/:id" element={<ProductPage />} />
    <Route exact path="/ProductsPage" element={<ProductsPage />} />
    <Route exact path="/Vendorprofile/:id" element={<VendorProfile />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route exact path="/careers" element={<careersPage />} />
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
);

const VendorRoutes = () => (
  <Routes>
    <Route path="/vendor-dashboard/:vendorId" element={<VendorHome />} />
    <Route path="/orderDetail/:id" element={<OrderDetails />} />
    <Route path="/update-product" element={<UpdateProductForm />} />
    <Route path="/adminpanel" element={<AdminHome />} />
    <Route path="/notificationspage" element={<NotificationsPage />} />
    <Route path="/signin-vendor" element={<SigninVendor />} />
    <Route path="/signupvendor" element={<Signupvendor />} />
    <Route path="/addbrand" element={<BrandForm />} />
    <Route path="/edit-employee/:id" element={<EditEmployee />} />
  </Routes>
);

function App() {
  return (
    <UserProvider>
      <VendorProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <PublicRoutes />
            <VendorRoutes />
          </Router>
        </CartProvider>
      </VendorProvider>
    </UserProvider>
  );
}

export default App;
