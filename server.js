require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./middleware/logger");
const auth = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(logger);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// API routes
app.use("/api/products", auth, productRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
