const sequelize = require("../config/database");

const User = require("./user.model")(sequelize);
const Category = require("./category.model")(sequelize);
const Product = require("./product.model")(sequelize);
const ProductImage = require("./product-image.model")(sequelize);
const ProductOption = require("./product-option.model")(sequelize);
const ProductCategory = require("./product-category.model")(sequelize);

Product.hasMany(ProductImage, {
  foreignKey: "product_id",
  as: "images",
});
ProductImage.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

Product.hasMany(ProductOption, {
  foreignKey: "product_id",
  as: "options",
});
ProductOption.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: "product_id",
  otherKey: "category_id",
  as: "categories",
});
Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: "category_id",
  otherKey: "product_id",
  as: "products",
});

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
  ProductOption,
  ProductCategory,
};
