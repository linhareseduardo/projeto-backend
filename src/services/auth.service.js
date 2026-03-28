const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

async function generateToken(payload) {
  const { email, password } = payload;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return { error: "Invalid credentials", status: 400 };
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return { error: "Invalid credentials", status: 400 };
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { data: { token } };
}

module.exports = {
  generateToken,
};
