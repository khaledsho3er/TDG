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
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route exact path="/home" Component={Home} />
        <Route exact path="/login" Component={LoginPage} />
        <Route exact path="/signup" Component={SignUpPage} />
        <Route exact path="/AboutUs" Component={AboutUsPage} />
        <Route exact path="/Job" Component={JobDesc} />
        <Route exact path="/policy" Component={TermsOfService} />
        <Route exact path="/partners" Component={PartnersApplication} />
        <Route exact path="/contactus" Component={ContactUs} />
      </Routes>
    </Router>
  );
}

export default App;
