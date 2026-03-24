import React from "react";
import PropTypes from "prop-types";
import "../App.css"

Product.propTypes = {};

function Product({ product, onAddToCart, onEdit, onDelete }) {
  return (
    <div className="product">
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
      <button className="edit-btn" onClick={() => onEdit(product)}>Edit</button>
      <button className="delete-btn" onClick={() => onDelete(product.id)}>Delete</button>
    </div>
  );
}

export default Product;
