import React from "react";
import "../App.css";
import ProductShowcase from "../Components/productShowcase";
import SignUpForm from "../Components/signUpForm";
function SignUpPage() {
  return (
    <div className="container">
      <div className="left-panel">
        <SignUpForm />
      </div>
      <div className="right-panel">
        <ProductShowcase />
      </div>
    </div>
  );
}
export default SignUpPage;
