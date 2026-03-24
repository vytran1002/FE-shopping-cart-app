import React, { useState } from 'react';
import Product from './components/Product';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 15 },
    { id: 3, name: 'Product 3', price: 20 },
  ]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleCheckout = () => {
    setCartItems([]);
    setShowCheckout(false);
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.price) {
      const id = Math.max(...products.map(p => p.id)) + 1;
      setProducts([...products, { id, name: newProduct.name, price: parseFloat(newProduct.price) }]);
      setNewProduct({ name: '', price: '' });
    }
  };

  const editProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };
  return (
    <div className="app">
      <div className="product-list">
        <h2>Products</h2>
        {products.map((product) => (
          <Product key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
      <div className="management">
        <h2>Manage Products</h2>
        <div className="add-product">
          <h3>Add New Product</h3>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <button onClick={addProduct}>Add Product</button>
        </div>
        <div className="product-management-list">
          <h3>Existing Products</h3>
          {products.map((product) => (
            <div key={product.id} className="manage-product">
              {editingProduct && editingProduct.id === product.id ? (
                <div>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  />
                  <button onClick={() => editProduct(product.id, { name: editingProduct.name, price: parseFloat(editingProduct.price) })}>Save</button>
                  <button onClick={() => setEditingProduct(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <span>{product.name} - ${product.price}</span>
                  <button onClick={() => setEditingProduct(product)}>Edit</button>
                  <button onClick={() => deleteProduct(product.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Cart cartItems={cartItems} onRemoveFromCart={removeFromCart} onUpdateQuantity={updateQuantity} onShowCheckout={() => setShowCheckout(true)} />
      {showCheckout && <Checkout cartItems={cartItems} onCheckout={handleCheckout} onClose={() => setShowCheckout(false)} />}
    </div>
  );
}

export default App;
