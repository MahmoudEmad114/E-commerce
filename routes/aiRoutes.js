const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate-product-description', aiController.generateProductDescription);

module.exports = router;