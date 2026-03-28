const { Category } = require("../models");

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseFields(fields) {
  if (!fields) return ["id", "name", "slug", "use_in_menu"];

  const allowedFields = ["id", "name", "slug", "use_in_menu"];
  const parsedFields = fields
    .split(",")
    .map((field) => field.trim())
    .filter((field) => allowedFields.includes(field));

  return parsedFields.length > 0 ? parsedFields : allowedFields;
}

async function searchCategories(query) {
  const limit = query.limit ? Number(query.limit) : 12;
  const page = query.page ? Number(query.page) : 1;
  const fields = parseFields(query.fields);
  const useInMenu = parseBoolean(query.use_in_menu);

  if (Number.isNaN(limit) || Number.isNaN(page) || page < 1 || limit < -1 || limit === 0) {
    return { error: "Invalid query params", status: 400 };
  }

  const where = {};
  if (useInMenu !== undefined) {
    where.use_in_menu = useInMenu;
  }

  if (limit === -1) {
    const rows = await Category.findAll({ where, attributes: fields });

    return {
      data: {
        data: rows,
        total: rows.length,
        limit: -1,
        page,
      },
    };
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await Category.findAndCountAll({
    where,
    attributes: fields,
    limit,
    offset,
  });

  return {
    data: {
      data: rows,
      total: count,
      limit,
      page,
    },
  };
}

async function findCategoryById(id) {
  return Category.findByPk(id);
}

async function createCategory(payload) {
  const { name, slug, use_in_menu } = payload;

  const category = await Category.create({
    name,
    slug,
    use_in_menu,
  });

  return { data: category };
}

async function updateCategory(id, payload) {
  const category = await Category.findByPk(id);

  if (!category) {
    return { error: "Category not found", status: 404 };
  }

  await category.update(payload);

  return { data: null };
}

async function deleteCategory(id) {
  const category = await Category.findByPk(id);

  if (!category) {
    return { error: "Category not found", status: 404 };
  }

  await category.destroy();

  return { data: null };
}

module.exports = {
  searchCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
