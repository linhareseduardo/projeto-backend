const authService = require("../services/auth.service");

async function createToken(req, res) {
  const result = await authService.generateToken(req.body);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(200).json(result.data);
}

module.exports = {
  createToken,
};
