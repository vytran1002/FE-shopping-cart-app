import React, { useState, useEffect } from 'react';
import Product from './components/Product';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  };
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
      fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProduct.name, price: parseFloat(newProduct.price) })
      })
      .then(response => response.json())
      .then(data => {
        setProducts([...products, data]);
        setNewProduct({ name: '', price: '' });
      })
      .catch(error => console.error('Error adding product:', error));
    }
  };

  const editProduct = (id, updatedProduct) => {
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    })
    .then(response => response.json())
    .then(data => {
      setProducts(products.map(p => p.id === id ? data : p));
      setEditingProduct(null);
    })
    .catch(error => console.error('Error editing product:', error));
  };

  const deleteProduct = (id) => {
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setProducts(products.filter(p => p.id !== id));
    })
    .catch(error => console.error('Error deleting product:', error));
  };
  return (
    <div className="app">
      <div className="product-list">
        <h2>Products</h2>
        {products.map((product) => (
          <Product key={product.id} product={product} onAddToCart={addToCart} onEdit={() => setEditingProduct(product)} onDelete={deleteProduct} />
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
