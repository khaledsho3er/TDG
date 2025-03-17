import React, { useState, useEffect, useContext } from "react";
import { Box } from "@mui/material";
import Header from "../Components/navBar";
import axios from "axios";
import Profile from "../Components/account/profile";
import { UserContext } from "../utils/userContext";
import { useNavigate } from "react-router-dom";
import ResetPasswordForm from "../Components/profilePopup/resetPassowrd";
import ShippingInfoPopup from "../Components/profilePopup/Shipping";
import WishlistPage from "../Components/account/wishlist";
import { useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import TrackOrder from "./TrackOrder";
import LoadingScreen from "./loadingScreen";
import BillingInfo from "../Components/profilePopup/billingInfo";

// import BillingInfo from "../Components/profilePopup/billingInfo";
const MyAccount = () => {
  const [selectedSection, setSelectedSection] = useState("profile");
  const { userSession, logout } = useContext(UserContext); // Access user session and logout function from context
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    phoneNumber: "",
    gender: "",
  });
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.section) {
      setSelectedSection(location.state.section);
    }
  }, [location]);
  useEffect(() => {
    // Redirect to login if user is not logged in
    if (!userSession) {
      navigate("/login"); // Redirect to login page if no session
      return;
    }

    // Fetch user data if logged in
    const fetchData = async () => {
      console.log("id in MyAccount:", userSession.id);
      try {
        const response = await axios.get(
          `https://tdg-db.onrender.com/api/getUserById/${userSession.id}`,
          {
            withCredentials: true,
          }
        );
        console.log("userSession in MyAccount:", userSession);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response || error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    };

    fetchData();
  }, [userSession, navigate]); // Add `navigate` to the dependencies

  const handleLogout = () => {
    logout(); // Call logout from context
    navigate("/home"); // Redirect to home or login page
  };
  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }
  const sections = {
    profile: <Profile userData={userData} />, // Pass userData as a prop
    orders: <TrackOrder />,
    Password: <ResetPasswordForm />,
    // Billing: <BillingInfo />,
    shipping: <ShippingInfoPopup />,
    billing: <BillingInfo />,
    wishlist: <WishlistPage />,
    // Render logout as a clickable word that performs the logout directly
    logout: (
      <span
        style={{ cursor: "pointer" }}
        onClick={handleLogout} // Trigger logout directly without interfering with section logic
      >
        Logout
      </span>
    ),
  };

  return (
    <Box>
      <Header />
      <Box>
        <div className="hero-job-container">
          <div className="hero-text">
            <h1 className="hero-title">Hey, {userData.firstName}</h1>
          </div>
        </div>
        <div className="terms-container">
          {/* Sidebar */}
          <div className="sidebar">
            {Object.keys(sections).map((section) =>
              section !== "logout" ? (
                <button
                  key={section}
                  className={`sidebar-item ${
                    selectedSection === section ? "active" : ""
                  }`}
                  onClick={() => setSelectedSection(section)}
                >
                  {section}
                </button>
              ) : (
                <div key={section} className="sidebar-item">
                  {sections[section]}
                </div>
              )
            )}
          </div>
          <div className="divider"></div>

          {/* Content Section */}
          <div className="content">{sections[selectedSection]}</div>
        </div>
      </Box>
      <Footer />
    </Box>
  );
};

export default MyAccount;
