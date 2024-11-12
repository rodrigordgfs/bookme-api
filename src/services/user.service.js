import userRepositorie from "../repositories/user.repositorie.js";
import { hashPassword, verifyPassword } from "../utils/passwordCriptDecript.js";
import { StatusCodes } from "http-status-codes";
import authMiddleware from "../middlewares/authMiddleware.js";
import AppError from "../utils/error.js";

const checkUserExistsByEmail = async (email) => {
  const user = await userRepositorie.getUserByEmail(email);
  if (user) {
    throw new AppError("User already exists", StatusCodes.CONFLICT);
  }
};

const checkUserExistsById = async (id) => {
  const user = await userRepositorie.getUserById(id);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  return user;
};

const register = async (name, email, password) => {
  await checkUserExistsByEmail(email);

  const hashedPassword = await hashPassword(password);
  const user = await userRepositorie.register(name, email, hashedPassword);

  user.token = await authMiddleware.generateToken(user.id);
  return user;
};

const login = async (email, password) => {
  const user = await userRepositorie.getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password))) {
    throw new AppError("Email or password incorrect", StatusCodes.UNAUTHORIZED);
  }

  delete user.password;
  user.token = await authMiddleware.generateToken(user.id);
  return user;
};

const getUserById = async (id) => {
  return await checkUserExistsById(id);
};

const getUsers = async () => {
  return await userRepositorie.getUsers();
};

const patchUser = async (id, name) => {
  await checkUserExistsById(id);
  return await userRepositorie.patchUser(id, name);
};

const deleteUser = async (id) => {
  await checkUserExistsById(id);
  await userRepositorie.deleteUser(id);
};

export default {
  register,
  login,
  getUserById,
  patchUser,
  deleteUser,
  getUsers,
};
