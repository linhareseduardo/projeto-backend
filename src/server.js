require("dotenv").config();

const app = require("./app");
const syncDatabase = require("./config/sync-database");

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await syncDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message || error);
    process.exit(1);
  }
}

bootstrap();
