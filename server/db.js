// server/db.js
const { Pool } = require("pg"); // Use Pool instead of Client

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_URL,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if a connection cannot be established
});

// Check for successful connection
pool
  .connect()
  .then((client) => {
    client.release(); // Release the client back to the pool
  })
  .catch((err) => {
    console.error("PostgreSQL connection error:", err);
  });

module.exports = pool;
