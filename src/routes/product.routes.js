const { Router } = require("express");

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {
  validateCreateProductPayload,
  validateUpdateProductPayload,
} = require("../middleware/validate-product-payload.middleware");

const router = Router();

router.get("/v1/product/search", productController.searchProducts);
router.get("/v1/product/:id", productController.getProductById);
router.post(
  "/v1/product",
  authMiddleware,
  validateCreateProductPayload,
  productController.createProduct
);
router.put(
  "/v1/product/:id",
  authMiddleware,
  validateUpdateProductPayload,
  productController.updateProduct
);
router.delete("/v1/product/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
