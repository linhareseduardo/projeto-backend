const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ProductCategory = sequelize.define(
    "ProductCategory",
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      tableName: "product_categories",
      timestamps: false,
      underscored: true,
    }
  );

  return ProductCategory;
};
