const userService = require("../services/user.service");

async function getUserById(req, res) {
  const { id } = req.params;

  const user = await userService.findUserById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
}

async function createUser(req, res) {
  const result = await userService.createUser(req.body);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(201).json(result.data);
}

async function updateUser(req, res) {
  const { id } = req.params;

  const result = await userService.updateUser(id, req.body);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(204).send();
}

async function deleteUser(req, res) {
  const { id } = req.params;

  const result = await userService.deleteUser(id);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(204).send();
}

module.exports = {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
