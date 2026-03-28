const express = require("express");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

module.exports = app;
