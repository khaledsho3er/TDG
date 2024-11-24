import ProductShowcase from "../Components/productShowcase";
import SignInForm from "../Components/signInForm";
import React from "react";
function LoginPage() {
  return (
    <div className="container">
      <div className="left-panel">
        <SignInForm />
      </div>
      <div className="right-panel">
        <ProductShowcase />
      </div>
    </div>
  );
}
export default LoginPage;
