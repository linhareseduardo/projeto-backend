const { Op } = require("sequelize");

const {
  sequelize,
  Product,
  ProductImage,
  ProductOption,
  Category,
} = require("../models");

function mapImageOutput(image) {
  return {
    id: image.id,
    content: image.path,
  };
}

function mapOptionOutput(option) {
  return {
    id: option.id,
    title: option.title,
    shape: option.shape,
    radius: option.radius,
    type: option.type,
    values: option.values ? option.values.split(",") : [],
  };
}

function mapProductOutput(product, fields) {
  const raw = {
    id: product.id,
    enabled: product.enabled,
    name: product.name,
    slug: product.slug,
    stock: product.stock,
    description: product.description,
    price: product.price,
    price_with_discount: product.price_with_discount,
    category_ids: (product.categories || []).map((category) => category.id),
    images: (product.images || []).map(mapImageOutput),
    options: (product.options || []).map(mapOptionOutput),
  };

  if (!fields) {
    return raw;
  }

  const selected = fields
    .split(",")
    .map((field) => field.trim())
    .filter((field) => Object.prototype.hasOwnProperty.call(raw, field));

  if (selected.length === 0) {
    return raw;
  }

  return selected.reduce((acc, key) => {
    acc[key] = raw[key];
    return acc;
  }, {});
}

function parsePriceRange(priceRange) {
  if (!priceRange) return null;

  const [min, max] = priceRange.split("-").map(Number);

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return null;
  }

  return { min, max };
}

function buildProductWhere(query) {
  const where = {};

  if (query.match) {
    where[Op.or] = [
      { name: { [Op.like]: `%${query.match}%` } },
      { description: { [Op.like]: `%${query.match}%` } },
    ];
  }

  const priceRange = parsePriceRange(query["price-range"]);
  if (priceRange) {
    where.price = {
      [Op.between]: [priceRange.min, priceRange.max],
    };
  }

  return where;
}

function parseOptionFilters(query) {
  const optionFilters = [];

  Object.keys(query).forEach((key) => {
    const match = key.match(/^option\[(\d+)\]$/);
    if (!match) return;

    const optionId = Number(match[1]);
    const values = String(query[key])
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!Number.isNaN(optionId) && values.length > 0) {
      optionFilters.push({ optionId, values });
    }
  });

  return optionFilters;
}

async function searchProducts(query) {
  const limit = query.limit ? Number(query.limit) : 12;
  const page = query.page ? Number(query.page) : 1;

  if (Number.isNaN(limit) || Number.isNaN(page) || page < 1 || limit < -1 || limit === 0) {
    return { error: "Invalid query params", status: 400 };
  }

  const where = buildProductWhere(query);
  const includes = [
    { model: ProductImage, as: "images" },
    { model: ProductOption, as: "options" },
    {
      model: Category,
      as: "categories",
      through: { attributes: [] },
    },
  ];

  if (query.category_ids) {
    const categoryIds = query.category_ids
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !Number.isNaN(id));

    if (categoryIds.length > 0) {
      includes[2].where = { id: { [Op.in]: categoryIds } };
      includes[2].required = true;
    }
  }

  const optionFilters = parseOptionFilters(query);
  if (optionFilters.length > 0) {
    const optionWhere = {
      [Op.or]: optionFilters.map((filter) => ({
        id: filter.optionId,
        [Op.or]: filter.values.map((value) => ({
          values: { [Op.like]: `%${value}%` },
        })),
      })),
    };

    includes[1].where = optionWhere;
    includes[1].required = true;
  }

  if (limit === -1) {
    const products = await Product.findAll({
      where,
      include: includes,
      distinct: true,
    });

    const data = products.map((product) => mapProductOutput(product, query.fields));

    return {
      data: {
        data,
        total: data.length,
        limit: -1,
        page,
      },
    };
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await Product.findAndCountAll({
    where,
    include: includes,
    limit,
    offset,
    distinct: true,
  });

  const data = rows.map((product) => mapProductOutput(product, query.fields));

  return {
    data: {
      data,
      total: count,
      limit,
      page,
    },
  };
}

async function findProductById(id) {
  const product = await Product.findByPk(id, {
    include: [
      { model: ProductImage, as: "images" },
      { model: ProductOption, as: "options" },
      { model: Category, as: "categories", through: { attributes: [] } },
    ],
  });

  if (!product) {
    return { error: "Product not found", status: 404 };
  }

  return { data: mapProductOutput(product) };
}

async function createProduct(payload) {
  const transaction = await sequelize.transaction();

  try {
    const {
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
      category_ids = [],
      images = [],
      options = [],
    } = payload;

    const product = await Product.create(
      {
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount,
      },
      { transaction }
    );

    if (Array.isArray(images) && images.length > 0) {
      await ProductImage.bulkCreate(
        images.map((image) => ({
          product_id: product.id,
          enabled: true,
          path: image.content,
        })),
        { transaction }
      );
    }

    if (Array.isArray(options) && options.length > 0) {
      await ProductOption.bulkCreate(
        options.map((option) => ({
          product_id: product.id,
          title: option.title,
          shape: option.shape,
          radius: Number.parseInt(String(option.radius || 0), 10) || 0,
          type: option.type,
          values: Array.isArray(option.values)
            ? option.values.join(",")
            : Array.isArray(option.value)
              ? option.value.join(",")
              : String(option.values || option.value || ""),
        })),
        { transaction }
      );
    }

    if (Array.isArray(category_ids) && category_ids.length > 0) {
      await product.setCategories(category_ids, { transaction });
    }

    await transaction.commit();

    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: ProductImage, as: "images" },
        { model: ProductOption, as: "options" },
        { model: Category, as: "categories", through: { attributes: [] } },
      ],
    });

    return { data: mapProductOutput(createdProduct) };
  } catch (_error) {
    await transaction.rollback();
    return { error: "Failed to create product", status: 400 };
  }
}

async function updateProduct(id, payload) {
  const transaction = await sequelize.transaction();

  try {
    const product = await Product.findByPk(id, { transaction });

    if (!product) {
      await transaction.rollback();
      return { error: "Product not found", status: 404 };
    }

    const {
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
      category_ids,
      images,
      options,
    } = payload;

    await product.update(
      {
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount,
      },
      { transaction }
    );

    if (Array.isArray(category_ids)) {
      await product.setCategories(category_ids, { transaction });
    }

    if (Array.isArray(images)) {
      for (const image of images) {
        if (image.deleted && image.id) {
          await ProductImage.destroy({
            where: { id: image.id, product_id: product.id },
            transaction,
          });
          continue;
        }

        if (image.id) {
          await ProductImage.update(
            {
              path: image.content || image.path || image.content,
            },
            {
              where: { id: image.id, product_id: product.id },
              transaction,
            }
          );
          continue;
        }

        if (image.content) {
          await ProductImage.create(
            {
              product_id: product.id,
              enabled: true,
              path: image.content,
            },
            { transaction }
          );
        }
      }
    }

    if (Array.isArray(options)) {
      for (const option of options) {
        if (option.deleted && option.id) {
          await ProductOption.destroy({
            where: { id: option.id, product_id: product.id },
            transaction,
          });
          continue;
        }

        const values = Array.isArray(option.values)
          ? option.values.join(",")
          : Array.isArray(option.value)
            ? option.value.join(",")
            : option.values || option.value;

        if (option.id) {
          await ProductOption.update(
            {
              title: option.title,
              shape: option.shape,
              radius: Number.parseInt(String(option.radius || 0), 10) || 0,
              type: option.type,
              values,
            },
            {
              where: { id: option.id, product_id: product.id },
              transaction,
            }
          );
          continue;
        }

        await ProductOption.create(
          {
            product_id: product.id,
            title: option.title,
            shape: option.shape,
            radius: Number.parseInt(String(option.radius || 0), 10) || 0,
            type: option.type,
            values,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    return { data: null };
  } catch (_error) {
    await transaction.rollback();
    return { error: "Failed to update product", status: 400 };
  }
}

async function deleteProduct(id) {
  const product = await Product.findByPk(id);

  if (!product) {
    return { error: "Product not found", status: 404 };
  }

  await ProductImage.destroy({ where: { product_id: product.id } });
  await ProductOption.destroy({ where: { product_id: product.id } });
  await product.setCategories([]);
  await product.destroy();

  return { data: null };
}

module.exports = {
  searchProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
