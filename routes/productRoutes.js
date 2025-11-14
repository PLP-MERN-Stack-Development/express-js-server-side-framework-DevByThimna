const express = require("express");
const { v4: uuidv4 } = require("uuid");
const products = require("../data/products");
const validateProduct = require("../middleware/validateProduct");

const router = express.Router();

// GET all products
router.get("/", (req, res) => {
  res.json(products);
});

// GET by ID
router.get("/:id", (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST create
router.post("/", validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = { id: uuidv4(), name, description, price, category, inStock };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update
router.put("/:id", validateProduct, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE
router.delete("/:id", (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  products.splice(index, 1);
  res.status(204).send();
});

module.exports = router;

router.get("/", (req, res) => {
  let result = [...products];
  const { category, search, page = 1, limit = 5 } = req.query;

  // Filtering
  if (category) result = result.filter(p => p.category === category);

  // Search
  if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // Pagination
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + parseInt(limit));

  res.json({
    total: result.length,
    page: parseInt(page),
    limit: parseInt(limit),
    products: paginated
  });
});

// Product statistics
router.get("/stats/all", (req, res) => {
  const stats = {};
  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats);
});
