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
      const userNames = [
        { firstname: "João", surname: "Silva" },
        { firstname: "Maria", surname: "Santos" },
        { firstname: "Pedro", surname: "Oliveira" },
        { firstname: "Ana", surname: "Costa" },
        { firstname: "Carlos", surname: "Ferreira" },
        { firstname: "Lucia", surname: "Mendes" },
        { firstname: "Roberto", surname: "Gomes" },
        { firstname: "Fernanda", surname: "Rocha" },
        { firstname: "Bruno", surname: "Silva" },
        { firstname: "Patricia", surname: "Alves" },
      ];

      const users = Array.from({ length: usersToAdd }, (_, i) => ({
        firstname: userNames[i % userNames.length].firstname,
        surname: userNames[i % userNames.length].surname,
        email: `${userNames[i % userNames.length].firstname.toLowerCase()}.${userNames[i % userNames.length].surname.toLowerCase()}.${i + 1}@sportstore.com`,
        password: passwordHash,
      }));

      await User.bulkCreate(users, { transaction: tx });
    }

    const newCategories = [];
    const categoryNames = [
      { name: "Futebol & Futsal", slug: "futebol-futsal" },
      { name: "Corrida & Atletismo", slug: "corrida-atletismo" },
      { name: "Musculação & Fitness", slug: "musculacao-fitness" },
      { name: "Tênis & Raquetes", slug: "tenis-raquetes" },
      { name: "Natação & Esportes Aquáticos", slug: "natacao-esportes-aquaticos" },
    ];

    for (let i = 0; i < categoriesToAdd; i += 1) {
      const categoryData = categoryNames[i % categoryNames.length];
      const category = await Category.create(
        {
          name: categoryData.name,
          slug: categoryData.slug,
          use_in_menu: true,
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

    const getProductData = (index) => {
      const allProducts = [
        // Futebol (3)
        { name: "Chuteira Nike Phantom GX", price: 599.90, discount: 479.90, stock: 12, description: "Chuteira profissional para futebol com tecnologia de controle de bola." },
        { name: "Bola Oficial FIFA", price: 349.90, discount: 279.90, stock: 15, description: "Bola oficial para jogos profissionais de futebol." },
        { name: "Uniforme de Treino Masculino", price: 189.90, discount: 149.90, stock: 20, description: "Uniforme confortavel com tecnologia de secagem rapida." },
        // Corrida (3)
        { name: "Tenis Running Asics Gel Nimbus", price: 549.90, discount: 429.90, stock: 10, description: "Tenis de corrida com amortecimento gel." },
        { name: "Mochila Esportiva 30L", price: 229.90, discount: 179.90, stock: 18, description: "Mochila resistente para equipamentos esportivos." },
        { name: "Relogio GPS Garmin Forerunner", price: 1299.90, discount: 999.90, stock: 8, description: "Relogio com GPS integrado para monitoramento." },
        // Musculacao (3)
        { name: "Halteres Ajustaveis 20kg", price: 449.90, discount: 349.90, stock: 14, description: "Par de halteres com discos de peso intercambiavel." },
        { name: "Colchonete Yoga Premium 10mm", price: 189.90, discount: 149.90, stock: 22, description: "Colchonete antiderrapante para yoga e pilates." },
        { name: "Fone Bluetooth Sem Fio", price: 279.90, discount: 219.90, stock: 25, description: "Fone resistente a agua ideal para esportes." },
        // Tenis (3)
        { name: "Raquete Head Titanium Pro", price: 799.90, discount: 599.90, stock: 9, description: "Raquete profissional com frame em titanio." },
        { name: "Bola de Tenis Pressurizada Wilson", price: 79.90, discount: 59.90, stock: 50, description: "Lata com 3 bolas pressurizada profissional." },
        { name: "Grips Anti-Suor para Raquete", price: 49.90, discount: 39.90, stock: 60, description: "Grip de alta qualidade com tecnologia anti-suor." },
        // Natacao (3)
        { name: "Oculos Speedo Mariner", price: 129.90, discount: 99.90, stock: 30, description: "Oculos de piscina com protecao UV." },
        { name: "Sunga Competition Speedo", price: 199.90, discount: 159.90, stock: 15, description: "Sunga profissional com tecnologia de secagem rapida." },
        { name: "Touca em Latex Impermeavel", price: 49.90, discount: 39.90, stock: 40, description: "Touca de natacao impermeavel para protecao." },
      ];
      return allProducts[index] || allProducts[0];
    };

    for (let i = 0; i < productsToAdd; i += 1) {
      const product = getProductData(i);
      const createdProduct = await Product.create(
        {
          enabled: true,
          name: product.name,
          slug: product.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          use_in_menu: true,
          stock: product.stock,
          description: product.description,
          price: product.price,
          price_with_discount: product.discount,
        },
        { transaction: tx }
      );

      const category = categoriesForProducts[i % categoriesForProducts.length];

      await ProductCategory.create(
        {
          product_id: createdProduct.id,
          category_id: category.id,
        },
        { transaction: tx }
      );

      await ProductImage.create(
        {
          product_id: createdProduct.id,
          enabled: true,
          path: `https://img.sportstore.com/${product.name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
        },
        { transaction: tx }
      );

      const sizeOption = ["P", "M", "G"][i % 3];
      await ProductOption.create(
        {
          product_id: createdProduct.id,
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
