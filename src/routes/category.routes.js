const { Router } = require("express");

const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validateCategoryPayload = require("../middleware/validate-category-payload.middleware");

const router = Router();

router.get("/v1/category/search", categoryController.searchCategories);
router.get("/v1/category/:id", categoryController.getCategoryById);
router.post(
  "/v1/category",
  authMiddleware,
  validateCategoryPayload,
  categoryController.createCategory
);
router.put(
  "/v1/category/:id",
  authMiddleware,
  validateCategoryPayload,
  categoryController.updateCategory
);
router.delete("/v1/category/:id", authMiddleware, categoryController.deleteCategory);

module.exports = router;
