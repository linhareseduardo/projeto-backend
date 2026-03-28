require("dotenv").config();

const { sequelize, User, Category, Product } = require("../src/models");
const { addSeedBatch } = require("../src/config/seed-default-data");

async function seed() {
  try {
    await addSeedBatch({
      usersToAdd: 10,
      categoriesToAdd: 5,
      productsToAdd: 15,
    });

    const [usersCount, categoriesCount, productsCount] = await Promise.all([
      User.count(),
      Category.count(),
      Product.count(),
    ]);

    console.log("Seed concluido com sucesso.");
    console.log(`users=${usersCount}, categories=${categoriesCount}, products=${productsCount}`);
  } catch (error) {
    console.error("Falha ao executar seed:", error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
