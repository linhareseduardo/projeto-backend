const { Router } = require("express");

const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validateIdParam = require("../middleware/validate-id-param.middleware");
const validateTokenPayload = require("../middleware/validate-token-payload.middleware");
const {
  validateCreateUserPayload,
  validateUpdateUserPayload,
} = require("../middleware/validate-user-payload.middleware");

const router = Router();

router.post("/v1/user/token", validateTokenPayload, authController.createToken);
router.get("/v1/user/:id", validateIdParam, userController.getUserById);
router.post("/v1/user", validateCreateUserPayload, userController.createUser);
router.put(
  "/v1/user/:id",
  validateIdParam,
  authMiddleware,
  validateUpdateUserPayload,
  userController.updateUser
);
router.delete("/v1/user/:id", validateIdParam, authMiddleware, userController.deleteUser);

module.exports = router;
