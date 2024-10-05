import "./assets/styles/App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Card from "./pages/cards.jsx";
import CheckoutPage from "./pages/checkout/Checkout.js";
import HomePage from "./pages/Dashboard/home.jsx";
import SignIn from "./pages/sign/sign-in/SignIn.jsx";
import SignUp from "./pages/sign/sign-up/signup.jsx";
import Cart from "./pages/cart/cart.jsx";
import About from "./pages/about/about.jsx"
import Contact from "./pages/contact/contact.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="api/cart" element={<Card />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/carts" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
      </Routes>
    </Router>
  );
}

export default App;
