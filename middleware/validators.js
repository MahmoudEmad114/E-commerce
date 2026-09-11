const { validationResult, body, query, param } = require("express-validator");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return next(new AppError(messages.join(". "), 400));
  }

  next();
};
/***********************************************************/
exports.signupRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

exports.loginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

/**************************************************/
exports.validatePagination = [
  query("after")
    .optional()
    .isInt({ min: 0 })
    .toInt()
    .withMessage("After must be a non-negative integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 30 })
    .toInt()
    .withMessage("Limit must be an integer between 1 and 30"),
];
exports.validateId = [param("id").isMongoId().withMessage("Invalid order ID")];
exports.validateStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "Shipped", "Delivered", "Cancelled"])
    .withMessage(
      "Status must be one of the following: Pending, Shipped, Delivered, Cancelled",
    ),
];
