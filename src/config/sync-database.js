const { sequelize } = require("../models");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function syncDatabase() {
  const retries = Number(process.env.DB_CONNECT_RETRIES || 10);
  const retryDelay = Number(process.env.DB_CONNECT_RETRY_DELAY_MS || 2000);

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      return;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      await sleep(retryDelay);
    }
  }
}

module.exports = syncDatabase;
