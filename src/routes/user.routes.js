const { Router } = require("express");

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {
  validateCreateUserPayload,
  validateUpdateUserPayload,
} = require("../middleware/validate-user-payload.middleware");

const router = Router();

router.get("/v1/user/:id", userController.getUserById);
router.post("/v1/user", validateCreateUserPayload, userController.createUser);
router.put(
  "/v1/user/:id",
  authMiddleware,
  validateUpdateUserPayload,
  userController.updateUser
);
router.delete("/v1/user/:id", authMiddleware, userController.deleteUser);

module.exports = router;
