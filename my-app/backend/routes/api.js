// routes/api.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from the API route!' });
});

module.exports = router;
