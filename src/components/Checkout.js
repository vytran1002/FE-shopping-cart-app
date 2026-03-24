import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../App.css";

Checkout.propTypes = {
  cartItems: PropTypes.array.isRequired,
  onCheckout: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

function Checkout({ cartItems, onCheckout, onClose }) {
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  const handleChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate payment processing
    alert('Payment successful!');
    onCheckout();
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="checkout-modal">
      <div className="checkout-content">
        <h2>Checkout</h2>
        <h3>Total: ${total}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name on Card:
            <input type="text" name="name" value={paymentInfo.name} onChange={handleChange} required />
          </label>
          <label>
            Card Number:
            <input type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={handleChange} required />
          </label>
          <label>
            Expiry Date (MM/YY):
            <input type="text" name="expiryDate" value={paymentInfo.expiryDate} onChange={handleChange} required />
          </label>
          <label>
            CVV:
            <input type="text" name="cvv" value={paymentInfo.cvv} onChange={handleChange} required />
          </label>
          <button type="submit">Pay Now</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;