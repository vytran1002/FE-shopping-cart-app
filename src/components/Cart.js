import React from 'react';
import PropTypes from 'prop-types';
import "../App.css"

Cart.propTypes = {
    
};

function Cart({ cartItems, onRemoveFromCart, onUpdateQuantity, onShowCheckout }) {
    return (
        <div className="cart">
      <h2>Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x 
            <button className="quantity-btn" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
            {item.quantity}
            <button className="quantity-btn" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
            <button onClick={() => onRemoveFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Total: ${calculateTotal(cartItems)}</h3>
      {cartItems.length > 0 && <button className="checkout-btn" onClick={onShowCheckout}>Checkout</button>}
    </div>
    );
}
const calculateTotal = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
export default Cart;
