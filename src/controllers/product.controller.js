const productService = require("../services/product.service");

async function searchProducts(req, res) {
  const result = await productService.searchProducts(req.query);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(200).json(result.data);
}

async function getProductById(req, res) {
  const { id } = req.params;
  const result = await productService.findProductById(id);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(200).json(result.data);
}

async function createProduct(req, res) {
  const result = await productService.createProduct(req.body);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(201).json(result.data);
}

async function updateProduct(req, res) {
  const { id } = req.params;

  const result = await productService.updateProduct(id, req.body);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(204).send();
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  const result = await productService.deleteProduct(id);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(204).send();
}

module.exports = {
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
