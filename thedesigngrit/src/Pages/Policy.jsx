import React, { useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../Components/navBar";
import HeroAbout from "../Components/About/heroAbout";
function CustomerPolicy() {
  const [selectedSection, setSelectedSection] = useState(
    "Full Terms of Service Agreement"
  );

  // Content for each section
  const sections = {
    "Full Terms of Service Agreement": (
      <div>
        <h2>1. INTRODUCTION</h2>
        <p>
          Welcome to TheDesignGrit. These Terms of Service govern your use of
          our website and services. By accessing and using TheDesignGrit, you
          agree to be bound by these Terms. If you do not agree with any part of
          these Terms, you must not use our services.
        </p>
        <h2>2. USE OF SERVICE</h2>
        <h3>2.1 Eligibility</h3>
        <p>
          You affirm that you are of legal age and have the legal capacity to
          enter into these Terms. By using our services, you represent that you
          meet these eligibility requirements.
        </p>
        <h3>2.2 Account Creation and Management</h3>
        <ul>
          <li>
            You may need to create an account to access certain features of our
            website.
          </li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account and password.
          </li>
          <li>
            You agree to accept responsibility for all activities that occur
            under your account.
          </li>
          <li>
            You must notify us immediately of any unauthorized use of your
            account.
          </li>
        </ul>
        <h2>3. Intellectual Property Rights</h2>
        <ul>
          <li>
            All content included on Thedesigngrit, such as text, graphics,
            logos, images, and software, is the property of Thedesigngrit or its
            suppliers and is protected by copyright and other laws.
          </li>
          <li>
            You may not reproduce, distribute, modify, create derivative works
            of, publicly display, or publicly perform any of our content without
            our prior written consent.
          </li>
        </ul>
        <h2>4. Prohibited Activities</h2>
        <ul>
          <li>
            You are prohibited from using the site or its content for any
            illegal or unauthorized purpose.
          </li>
          <li>
            Activities such as copyright infringement, sending spam, and
            conducting fraudulent activities are strictly prohibited.
          </li>
        </ul>
      </div>
    ),
    "Cookie Policy": <p>Details about our cookie policy...</p>,
    "Privacy Policy": <p>Details about our privacy policy...</p>,
    "Returns & Exchanges Policy": (
      <p>Details about our returns and exchanges policy...</p>
    ),
    "Payment Policy": <p>Details about our payment policy...</p>,
    "Shipping Policy": <p>Details about our shipping policy...</p>,
    "Security Policy": <p>Details about our security policy...</p>,
    "Compliance Policy": <p>Details about our compliance policy...</p>,
  };
  return (
    <Box className="policy-page">
      <NavBar />
      <Box>
        <HeroAbout
          title="Our Customer Policies"
          subtitle="Transparency and trust are at the heart of everything we do. Explore our policies to learn how we ensure a secure and seamless shopping experience at The Design Grit (TDG)."
          image={"Assets/PolicyHero.png"}
        />
      </Box>
      <div className="terms-container">
        {/* Sidebar */}
        <div className="sidebar">
          {Object.keys(sections).map((section) => (
            <button
              key={section}
              className={`sidebar-item ${
                selectedSection === section ? "active" : ""
              }`}
              onClick={() => setSelectedSection(section)}
            >
              {section}
            </button>
          ))}
        </div>
        <div className="divider"></div>

        {/* Content Section */}
        <div className="content">{sections[selectedSection]}</div>
      </div>
    </Box>
  );
}
export default CustomerPolicy;
