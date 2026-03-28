const express = require("express");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use(userRoutes);

module.exports = app;
