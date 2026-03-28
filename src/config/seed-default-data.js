const bcrypt = require("bcryptjs");

const {
  sequelize,
  User,
  Category,
  Product,
  ProductCategory,
  ProductImage,
  ProductOption,
} = require("../models");

async function addSeedBatch({ usersToAdd = 10, categoriesToAdd = 5, productsToAdd = 15 } = {}) {
  const tx = await sequelize.transaction();

  try {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const passwordHash = await bcrypt.hash("123@123", 10);

    if (usersToAdd > 0) {
      const users = Array.from({ length: usersToAdd }, (_, i) => ({
        firstname: `User${i + 1}`,
        surname: "Seed",
        email: `seed.user.${suffix}.${i + 1}@mail.com`,
        password: passwordHash,
      }));

      await User.bulkCreate(users, { transaction: tx });
    }

    const newCategories = [];
    for (let i = 0; i < categoriesToAdd; i += 1) {
      const category = await Category.create(
        {
          name: `Categoria Seed ${i + 1}`,
          slug: `categoria-seed-${suffix}-${i + 1}`,
          use_in_menu: i % 2 === 0,
        },
        { transaction: tx }
      );
      newCategories.push(category);
    }

    let categoriesForProducts = await Category.findAll({ transaction: tx });

    if (productsToAdd > 0 && categoriesForProducts.length === 0) {
      const fallbackCategory = await Category.create(
        {
          name: "Categoria Seed Fallback",
          slug: `categoria-seed-fallback-${suffix}`,
          use_in_menu: true,
        },
        { transaction: tx }
      );
      categoriesForProducts = [fallbackCategory];
    }

    for (let i = 0; i < productsToAdd; i += 1) {
      const product = await Product.create(
        {
          enabled: true,
          name: `Produto Seed ${i + 1}`,
          slug: `produto-seed-${suffix}-${i + 1}`,
          use_in_menu: false,
          stock: 10 + i,
          description: `Produto seed gerado automaticamente ${i + 1}`,
          price: 99.9 + i,
          price_with_discount: 79.9 + i,
        },
        { transaction: tx }
      );

      const category = categoriesForProducts[i % categoriesForProducts.length];

      await ProductCategory.create(
        {
          product_id: product.id,
          category_id: category.id,
        },
        { transaction: tx }
      );

      await ProductImage.create(
        {
          product_id: product.id,
          enabled: true,
          path: `https://img.local/produto-seed-${suffix}-${i + 1}.png`,
        },
        { transaction: tx }
      );

      await ProductOption.create(
        {
          product_id: product.id,
          title: "Tamanho",
          shape: "square",
          radius: 4,
          type: "text",
          values: "P,M,G",
        },
        { transaction: tx }
      );
    }

    await tx.commit();

    return {
      usersAdded: usersToAdd,
      categoriesAdded: categoriesToAdd,
      productsAdded: productsToAdd,
      newCategoriesCount: newCategories.length,
    };
  } catch (error) {
    await tx.rollback();
    throw error;
  }
}

async function ensureMinimumSeedData({ minUsers = 10, minCategories = 5, minProducts = 15 } = {}) {
  const [usersCount, categoriesCount, productsCount] = await Promise.all([
    User.count(),
    Category.count(),
    Product.count(),
  ]);

  const usersToAdd = Math.max(0, minUsers - usersCount);
  const categoriesToAdd = Math.max(0, minCategories - categoriesCount);
  const productsToAdd = Math.max(0, minProducts - productsCount);

  if (usersToAdd === 0 && categoriesToAdd === 0 && productsToAdd === 0) {
    return {
      seeded: false,
      usersAdded: 0,
      categoriesAdded: 0,
      productsAdded: 0,
      counts: { usersCount, categoriesCount, productsCount },
    };
  }

  const added = await addSeedBatch({ usersToAdd, categoriesToAdd, productsToAdd });

  const [newUsersCount, newCategoriesCount, newProductsCount] = await Promise.all([
    User.count(),
    Category.count(),
    Product.count(),
  ]);

  return {
    seeded: true,
    ...added,
    counts: {
      usersCount: newUsersCount,
      categoriesCount: newCategoriesCount,
      productsCount: newProductsCount,
    },
  };
}

module.exports = {
  addSeedBatch,
  ensureMinimumSeedData,
};
