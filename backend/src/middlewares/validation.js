import { body, validationResult } from "express-validator";

export const validateEntry = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title is too long"),

  body("content").isLength({ max: 1000 }).withMessage("Content is too long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        errors: errors.array(),
      });
    }
    next();
  },
];
