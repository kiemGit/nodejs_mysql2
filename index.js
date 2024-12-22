const express = require('express');
const mysql = require('mysql2');

// Create an Express app
const app = express();
app.use(express.json());

// Configure MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // MySQL host
  user: process.env.DB_USER || 'hakim',      // MySQL username
  password: process.env.DB_PASSWORD || 'sap123ok',  // MySQL password
  database: process.env.DB_NAME || 'test',  // MySQL database
  waitForConnections: true,                 // Pool will wait for connections
  connectionLimit: 10,                      // Maximum number of connections
  queueLimit: 0,                            // Unlimited queue for connections
});

// Test MySQL connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL database.');
  connection.release();
});

// Define a simple API endpoint
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3210;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
