const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiController");

/**
 * @openapi
 * /ai/generate-product-description:
 *   post:
 *     tags:
 *       - AI
 *     summary: Generate a product description using AI
 *     description: Generates a short and user-friendly product description using Gemini AI based on the product name, category, and additional information.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 description: Product name
 *                 example: Wireless Headphones
 *               category:
 *                 type: string
 *                 description: Product category
 *                 example: Electronics
 *               info:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Additional product information
 *                 example: Bluetooth headphones with noise cancellation and 30 hours battery life
 *     responses:
 *       '200':
 *         description: Product description generated successfully
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
 *                   example: Description generated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Wireless Headphones
 *                     category:
 *                       type: string
 *                       example: Electronics
 *                     description:
 *                       type: string
 *                       example: Enjoy immersive sound with these wireless headphones featuring advanced noise cancellation and up to 30 hours of battery life.
 *
 *       '400':
 *         description: Invalid or missing input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       '401':
 *         description: Invalid Gemini API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       '429':
 *         description: Gemini API rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       '500':
 *         description: Gemini API key is not configured or an internal error occurred
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       '503':
 *         description: Gemini service is temporarily unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *       '504':
 *         description: Gemini API request timed out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    "/generate-product-description",
    aiController.generateProductDescription
);

module.exports = router;