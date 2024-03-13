// index.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Example data (you would normally store this in a database)
let products = [];

// Connect to the MySQL server
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL server');
});

// Create product table
const createProductTable = `CREATE TABLE IF NOT EXISTS products (
    productId INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255) NOT NULL
  )`;

// Create category table
const createCategoryTable = `CREATE TABLE IF NOT EXISTS categories (
    categoryId INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(255) NOT NULL
  )`;

// Execute queries to create tables
connection.query(createProductTable, (err, result) => {
    if (err) {
        console.error('Error creating product table:', err);
    } else {
        console.log('Product table created successfully');
    }
});

connection.query(createCategoryTable, (err, result) => {
    if (err) {
        console.error('Error creating category table:', err);
    } else {
        console.log('Category table created successfully');
    }
});

// Close the MySQL connection when done
connection.end();
// Routes
// Create a product
app.post('/products', (req, res) => {
    const { id, name } = req.body;
    products.push({ id, name });
    res.status(201).json({ message: 'Product created successfully' });
});

// Read all products
app.get('/products', (req, res) => {
    res.json(products);
});

// Read a single product
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        res.json(product);
    }
});

// Update a product
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        products[index].name = name;
        res.json({ message: 'Product updated successfully' });
    }
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        products.splice(index, 1);
        res.json({ message: 'Product deleted successfully' });
    }
});

// Example data (you would normally fetch this from a database)
const items = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

// Middleware to parse JSON requests
app.use(express.json());

// Paginated route
app.get('/items', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const limit = parseInt(req.query.limit) || 10; // Number of items per page, default to 10
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < items.length) {
        results.next = {
            page: page + 1,
            limit: limit
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        };
    }

    results.results = items.slice(startIndex, endIndex);

    res.json(results);
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
