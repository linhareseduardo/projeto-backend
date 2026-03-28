#!/usr/bin/env node
/**
 * Script para resetar completamente a base de dados
 * Execute: npm run db:reset
 */

require("dotenv").config();

const { sequelize } = require("../src/models");

async function resetDatabase() {
  try {
    console.log("🔄 Conectando ao banco de dados...");
    await sequelize.authenticate();
    console.log("✅ Conectado com sucesso!\n");

    console.log("🗑️  Deletando todas as tabelas...");
    // Desabilitar foreign keys para poder dropar as tabelas
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.drop({ cascade: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✅ Tabelas deletadas!\n");

    console.log("🔄 Recriando estrutura do banco...");
    await sequelize.sync({ force: true });
    console.log("✅ Estrutura recriada!\n");

    console.log("📦 Populando com novos dados...");
    const { ensureMinimumSeedData } = require("../src/config/seed-default-data");

    const seedResult = await ensureMinimumSeedData({
      minUsers: 10,
      minCategories: 5,
      minProducts: 15,
    });

    console.log("\n✨ Seed completo!");
    console.log(`   • Usuários adicionados: ${seedResult.usersAdded}`);
    console.log(`   • Categorias adicionadas: ${seedResult.categoriesAdded}`);
    console.log(`   • Produtos adicionados: ${seedResult.productsAdded}`);
    console.log(`   • Total no banco:`);
    console.log(`     - Usuários: ${seedResult.counts.usersCount}`);
    console.log(`     - Categorias: ${seedResult.counts.categoriesCount}`);
    console.log(`     - Produtos: ${seedResult.counts.productsCount}\n`);

    console.log("🎉 Reset do banco de dados concluído com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao resetar banco:", error.message);
    process.exit(1);
  }
}

resetDatabase();
