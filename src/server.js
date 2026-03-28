require("dotenv").config();

const app = require("./app");
const syncDatabase = require("./config/sync-database");
const { ensureMinimumSeedData } = require("./config/seed-default-data");

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await syncDatabase();

    const autoSeedEnabled = String(process.env.AUTO_SEED_ON_START || "true").toLowerCase() !== "false";
    if (autoSeedEnabled) {
      const seedResult = await ensureMinimumSeedData({
        minUsers: Number(process.env.SEED_MIN_USERS || 10),
        minCategories: Number(process.env.SEED_MIN_CATEGORIES || 5),
        minProducts: Number(process.env.SEED_MIN_PRODUCTS || 15),
      });

      if (seedResult.seeded) {
        console.log(
          `Seed aplicado: +${seedResult.usersAdded} users, +${seedResult.categoriesAdded} categories, +${seedResult.productsAdded} products`
        );
      }
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message || error);
    process.exit(1);
  }
}

bootstrap();
