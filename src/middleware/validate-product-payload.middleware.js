function validateCreateProductPayload(req, res, next) {
  const { name, slug, price, price_with_discount } = req.body;

  if (!name || !slug || price === undefined || price_with_discount === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  return next();
}

function validateUpdateProductPayload(req, res, next) {
  const { name, slug, price, price_with_discount } = req.body;

  if (!name || !slug || price === undefined || price_with_discount === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  return next();
}

module.exports = {
  validateCreateProductPayload,
  validateUpdateProductPayload,
};
