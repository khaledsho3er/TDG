import React from "react";
import Checkout from "../Components/Checkout/Checkout";
import NavBar from "../Components/navBar";
import Footer from "../Components/Footer";

function CheckoutPage() {
  return (
    <div>
      <NavBar />
      <Checkout />
      <div style={{ marginTop: "-16 px" }}>
        <Footer />
      </div>
    </div>
  );
}

export default CheckoutPage;
