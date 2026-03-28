function validateCreateUserPayload(req, res, next) {
  const { firstname, surname, email, password, confirmPassword } = req.body;

  if (!firstname || !surname || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password and confirmPassword must match" });
  }

  return next();
}

function validateUpdateUserPayload(req, res, next) {
  const { firstname, surname, email } = req.body;

  if (!firstname || !surname || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  return next();
}

module.exports = {
  validateCreateUserPayload,
  validateUpdateUserPayload,
};
