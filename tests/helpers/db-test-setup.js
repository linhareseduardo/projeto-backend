const { sequelize } = require("../../src/models");

async function waitForDatabase(maxAttempts = 20, waitMs = 1500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await sequelize.authenticate();
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(
          `Nao foi possivel conectar ao MySQL para testes. Verifique se o banco esta ativo. Erro: ${error.message}`
        );
      }

      await new Promise((resolve) => {
        setTimeout(resolve, waitMs);
      });
    }
  }
}

async function resetDatabase() {
  await sequelize.sync({ force: true });
}

async function closeDatabase() {
  await sequelize.close();
}

module.exports = {
  waitForDatabase,
  resetDatabase,
  closeDatabase,
};
