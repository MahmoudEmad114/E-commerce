const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

/**
 * @openapi
 * /orders:
 *   post:
 *     tags:
 *       - orders
 *     summary: Create a new order
 *     description: Creates an order for the logged-in customer, validates stock, and calculates total price.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 65f1a2b3c4d5e6f7a8b9c0d1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *           example:
 *             items:
 *               - productId: 65f1a2b3c4d5e6f7a8b9c0d1
 *                 quantity: 2
 *     responses:
 *       '201':
 *         description: Order created successfully
 *       '400':
 *         description: Empty order, duplicate products, invalid quantity, or insufficient stock
 *       '404':
 *         description: Product not found
 */
router.post('/', restrictTo('customer'), orderController.createOrder);

/**
 * @openapi
 * /orders/my:
 *   get:
 *     tags:
 *       - orders
 *     summary: Get current user's orders
 *     description: Returns all orders that belong to the logged-in customer.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of orders returned successfully
 */
router.get('/my', restrictTo('customer'), orderController.getMyOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags:
 *       - orders
 *     summary: Get a specific order
 *     description: Returns a single order by ID. Only accessible by the order's owner.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       '200':
 *         description: Order returned successfully
 *       '403':
 *         description: Access denied - order belongs to another customer
 *       '404':
 *         description: Order not found
 */
router.get('/:id', restrictTo('customer'), orderController.getOrderById);

/**
 * @openapi
 * /orders/{id}/cancel:
 *   post:
 *     tags:
 *       - orders
 *     summary: Cancel an order
 *     description: Cancels an eligible order (not already cancelled or delivered) and restores product stock.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       '200':
 *         description: Order cancelled successfully
 *       '400':
 *         description: Order is already cancelled or delivered
 *       '403':
 *         description: Access denied - order belongs to another customer
 *       '404':
 *         description: Order not found
 */
router.post('/:id/cancel', restrictTo('customer'), orderController.cancelOrder);

module.exports = router;