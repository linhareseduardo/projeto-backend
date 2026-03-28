function validateCategoryPayload(req, res, next) {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  return next();
}

module.exports = validateCategoryPayload;
