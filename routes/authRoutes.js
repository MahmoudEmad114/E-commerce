const express = require("express");
const { body, validationResult } = require("express-validator");

const authController = require("./../controllers/authController");
const authMiddleware = require("./../middleware/authMiddleware");
const AppError = require("./../utils/appError");
const {
  validate,
  loginRules,
  signupRules,
} = require("../middleware/validators");
const router = express.Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags:
 *       - auth
 *     summary: Register a new user account
 *     description: Creates a user, hashes the password and returns a JWT via HTTP-only cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInput'
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *             password: password123
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       '400':
 *         description: Validation or duplicate field error
 */
router.post("/signup", signupRules, validate, authController.signup);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Log in a user
 *     description: Validates credentials and returns a JWT via HTTP-only cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *           example:
 *             email: john@example.com
 *             password: password123
 *     responses:
 *       '200':
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       '401':
 *         description: Incorrect email or password
 *       '400':
 *         description: Validation error
 */
router.post("/login", loginRules, validate, authController.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - auth
 *     summary: Log out the current user
 *     description: Clears the JWT HTTP-only cookie.
 *     responses:
 *       '200':
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 */
router.post("/logout", authController.logout);

module.exports = router;
