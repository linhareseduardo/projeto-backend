const bcrypt = require("bcryptjs");
const { User } = require("../models");

async function findUserById(id) {
  return User.findByPk(id, {
    attributes: ["id", "firstname", "surname", "email"],
  });
}

async function createUser(payload) {
  const { firstname, surname, email, password } = payload;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return { error: "User with this email already exists", status: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({
    firstname,
    surname,
    email,
    password: hashedPassword,
  });

  return {
    data: {
      id: createdUser.id,
      firstname: createdUser.firstname,
      surname: createdUser.surname,
      email: createdUser.email,
    },
  };
}

async function updateUser(id, payload) {
  const { firstname, surname, email } = payload;

  const user = await User.findByPk(id);
  if (!user) {
    return { error: "User not found", status: 404 };
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser && existingUser.id !== Number(id)) {
    return { error: "Email already in use", status: 400 };
  }

  await user.update({ firstname, surname, email });

  return { data: null };
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    return { error: "User not found", status: 404 };
  }

  await user.destroy();

  return { data: null };
}

module.exports = {
  findUserById,
  createUser,
  updateUser,
  deleteUser,
};
