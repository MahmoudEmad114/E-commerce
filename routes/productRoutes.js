/**
 * @openapi
 * /products/test:
 *   get:
 *     tags:
 *       - products
 *     summary: Test products endpoint
 *     responses:
 *       200:
 *         description: Test successful
 */
const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: products
 *   description: Product management endpoints
 */

router.use(authMiddleware.protect);

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - products
 *     summary: Get all products
 *     description: Returns a list of all products. Accessible by authenticated customers and administrators.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Products retrieved successfully
 *       '401':
 *         description: Authentication required
 */
router.get('/', productController.getAllProducts);


/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - products
 *     summary: Get a product by ID
 *     description: Returns a specific product by its ID. Accessible by authenticated customers and administrators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *         example: 66c8f1a2b3c4d5e6f7a8b9c0
 *     responses:
 *       '200':
 *         description: Product retrieved successfully
 *       '400':
 *         description: Invalid product ID
 *       '401':
 *         description: Authentication required
 *       '404':
 *         description: Product not found
 */


/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - products
 *     summary: Create a new product
 *     description: Creates a new product. Accessible only by administrators.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wireless Headphones
 *               price:
 *                 type: number
 *                 example: 1500
 *               description:
 *                 type: string
 *                 example: High quality wireless headphones
 *               category:
 *                 type: string
 *                 example: Electronics
 *               image:
 *                 type: string
 *                 example: https://example.com/headphones.jpg
 *     responses:
 *       '201':
 *         description: Product created successfully
 *       '400':
 *         description: Invalid product data
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Admin access required
 */
router.post(
    '/',
    authMiddleware.restrictTo('admin'),
    productController.createProduct
);


/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     tags:
 *       - products
 *     summary: Update a product
 *     description: Updates an existing product. Accessible only by administrators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *         example: 66c8f1a2b3c4d5e6f7a8b9c0
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Headphones
 *               price:
 *                 type: number
 *                 example: 1800
 *               description:
 *                 type: string
 *                 example: Updated product description
 *               category:
 *                 type: string
 *                 example: Electronics
 *               image:
 *                 type: string
 *                 example: https://example.com/updated-headphones.jpg
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *       '400':
 *         description: Invalid product data
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Admin access required
 *       '404':
 *         description: Product not found
 */


/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags:
 *       - products
 *     summary: Delete a product
 *     description: Deletes a product. Accessible only by administrators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *         example: 66c8f1a2b3c4d5e6f7a8b9c0
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Admin access required
 *       '404':
 *         description: Product not found
 */

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(
        authMiddleware.restrictTo('admin'),
        productController.updateProduct
    )
    .delete(
        authMiddleware.restrictTo('admin'),
        productController.deleteProduct
    );

module.exports = router;
