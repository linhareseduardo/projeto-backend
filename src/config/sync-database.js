const { sequelize } = require("../models");

async function syncDatabase() {
  await sequelize.sync();
}

module.exports = syncDatabase;
