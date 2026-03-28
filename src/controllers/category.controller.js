const categoryService = require("../services/category.service");

async function searchCategories(req, res) {
  const result = await categoryService.searchCategories(req.query);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(200).json(result.data);
}

async function getCategoryById(req, res) {
  const { id } = req.params;

  const category = await categoryService.findCategoryById(id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res.status(200).json(category);
}

async function createCategory(req, res) {
  const result = await categoryService.createCategory(req.body);

  return res.status(201).json(result.data);
}

async function updateCategory(req, res) {
  const { id } = req.params;

  const result = await categoryService.updateCategory(id, req.body);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(204).send();
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  const result = await categoryService.deleteCategory(id);

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(204).send();
}

module.exports = {
  searchCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
