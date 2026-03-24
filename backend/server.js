const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MySQL connection
const dbConfig = {
  host: 'localhost',
  user: 'root', // Change to your MySQL user
  password: '1111', // Change to your MySQL password
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Create database if not exists
  db.query('CREATE DATABASE IF NOT EXISTS shopping_cart', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database shopping_cart ready');

    // Now connect to the database
    db.changeUser({ database: 'shopping_cart' }, (err) => {
      if (err) {
        console.error('Error switching to database:', err);
        return;
      }

      // Create products table if not exists
      db.query(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL
        )
      `, (err) => {
        if (err) throw err;
        console.log('Products table ready');
      });
    });
  });
});

// API Routes
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  db.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, price });
  });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  db.query('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, name, price });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});