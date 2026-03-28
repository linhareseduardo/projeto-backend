const { Router } = require("express");

const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validateIdParam = require("../middleware/validate-id-param.middleware");
const validateCategoryPayload = require("../middleware/validate-category-payload.middleware");

const router = Router();

router.get("/v1/category/search", categoryController.searchCategories);
router.get("/v1/category/:id", validateIdParam, categoryController.getCategoryById);
router.post(
  "/v1/category",
  authMiddleware,
  validateCategoryPayload,
  categoryController.createCategory
);
router.put(
  "/v1/category/:id",
  validateIdParam,
  authMiddleware,
  validateCategoryPayload,
  categoryController.updateCategory
);
router.delete(
  "/v1/category/:id",
  validateIdParam,
  authMiddleware,
  categoryController.deleteCategory
);

module.exports = router;
