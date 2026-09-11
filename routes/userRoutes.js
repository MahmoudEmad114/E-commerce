const express = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'))
/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - users
 *     summary: Get all users
 *     description: Returns a list of all users. Accessible only by administrators.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Users retrieved successfully
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
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Admin access required
 */
router.get('/', userController.getAllUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - users
 *     summary: Get a user by ID
 *     description: Returns a specific user. Accessible only by administrators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *         example: 66c8f1a2b3c4d5e6f7a8b9c0
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *       '400':
 *         description: Invalid user ID
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Admin access required
 *       '404':
 *         description: User not found
 */

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags:
 *       - users
 *     summary: Update a user
 *     description: Updates user information. Accessible only by administrators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *         example: 66c8f1a2b3c4d5e6f7a8b9c0
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *           example:
 *             name: John Updated
 *             email: john.updated@example.com
 *             role: admin
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Admin access required
 *       '404':
 *         description: User not found
 */

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - users
 *     summary: Delete a user
 *     description: Deletes a user. Accessible only by administrators.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *         example: 66c8f1a2b3c4d5e6f7a8b9c0
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Admin access required
 *       '404':
 *         description: User not found
 */
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router;

