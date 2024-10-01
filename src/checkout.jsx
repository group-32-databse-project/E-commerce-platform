// Importing necessary dependencies
import React, { useState } from 'react';
import Header from './header';

const CheckoutPage = () => {
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Order Placed', billingDetails);
  };

  return (
    <><Header /><div className="checkout-container">
      <form className="billing-details" onSubmit={handleSubmit}>
        <h2>Billing Details</h2>
        <div className="form-group">
          <label>Country</label>
          <input type="text" name="country" value="United States of America" readOnly />
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={billingDetails.firstName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={billingDetails.lastName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Company Name</label>
          <input type="text" name="companyName" value={billingDetails.companyName} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Street Address</label>
          <input type="text" name="address" value={billingDetails.address} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Apartment, suite, etc. (optional)</label>
          <input type="text" name="apartment" value={billingDetails.apartment} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Town / City</label>
          <input type="text" name="city" value={billingDetails.city} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>State / County</label>
          <input type="text" name="state" value={billingDetails.state} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Postcode / Zip</label>
          <input type="text" name="postalCode" value={billingDetails.postalCode} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" value={billingDetails.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" name="phone" value={billingDetails.phone} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <input type="checkbox" id="shipToDifferentAddress" />
          <label htmlFor="shipToDifferentAddress">Ship to a different address?</label>
        </div>
        <div className="form-group">
          <label>Order Notes (Optional)</label>
          <textarea name="orderNotes" />
        </div>
      </form>

      <div className="order-summary">
        <h2>Your Order</h2>
        <ul>
          <li>
            <span>Iphone X Gold</span> <span>$165.00</span>
          </li>
          <li>
            <span>Beats Studio Pro</span> <span>$50.00</span>
          </li>
          <li>
            <span>Cart Subtotal</span> <span>$215.00</span>
          </li>
          <li>
            <span>Shipping</span> <span>$10.00</span>
          </li>
          <li className="total">
            <span>Order Total</span> <span>$215.00</span>
          </li>
        </ul>

        <div className="payment-methods">
          <h3>Direct Bank Transfer</h3>
          <p>
            Make your payment directly into our bank account. Please use your Order ID as the payment reference.
          </p>
          <h3>Cheque Payment</h3>
          <div className="payment-options">
            <img src="paypal-logo.png" alt="PayPal" />
            <img src="visa-logo.png" alt="Visa" />
            {/* Add other logos */}
          </div>
        </div>

        <button type="submit" className="place-order-btn" onClick={handleSubmit}>
          Place Order
        </button>
      </div>
    </div></>
  );
};

export default CheckoutPage;
