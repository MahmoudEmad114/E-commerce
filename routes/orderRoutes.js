const express = require("express");
const orderController = require("../controllers/orderController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const validator = require("express-validator");
const {
    validateId,
    validateStatus,
    validate,
    validatePagination,
} = require("../middleware/validators");
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
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 65f1a2b3c4d5e6f7a8b9c0d1
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *     responses:
 *       '201':
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       '400':
 *         description: Empty order, duplicate products, invalid quantity, or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", restrictTo("customer"), orderController.createOrder);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 */
router.get("/my", restrictTo("customer"), orderController.getMyOrders);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       '403':
 *         description: Access denied - order belongs to another customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", restrictTo("customer", "admin"), orderController.getOrderById);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Order cancelled successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       '400':
 *         description: Order is already cancelled or delivered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Access denied - order belongs to another customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:id/cancel", restrictTo("customer"), orderController.cancelOrder);

router.use(restrictTo("admin"));

/**
 * @openapi
 * /orders:
 *   get:
 *     tags:
 *       - orders
 *     summary: Get all orders (admin)
 *     description: Returns a paginated list of all orders. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: after
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of items to skip for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 30
 *           default: 30
 *         description: Number of items to return per page
 *     responses:
 *       '200':
 *         description: List of all orders returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OrderWithCustomer'
 *       '400':
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
    "/",
    [...validatePagination, validate],
    orderController.getAllOrders,
);

/**
 * @openapi
 * /orders/{id}/details:
 *   get:
 *     tags:
 *       - orders
 *     summary: Get order details with populated fields (admin)
 *     description: Returns a single order with populated customer and product details. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order
 *         example: 65f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       '200':
 *         description: Order details returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/OrderDetailed'
 *       '400':
 *         description: Invalid order ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
    "/:id/details",
    [...validateId, validate],
    orderController.getOrderDetails,
);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     tags:
 *       - orders
 *     summary: Update order status (admin)
 *     description: Updates the status of an order. Status must progress forward (Pending → Confirmed → Shipped → Delivered). Cannot change status from Cancelled or to a previous status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order
 *         example: 65f1a2b3c4d5e6f7a8b9c0d1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - Confirmed
 *                   - Shipped
 *                   - Delivered
 *                   - Cancelled
 *                 example: Shipped
 *     responses:
 *       '200':
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Order status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       '400':
 *         description: Invalid status transition or invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
    "/:id/status",
    [...validateId, ...validateStatus],
    validate,
    orderController.updateOrderStatus,
);

module.exports = router;
