import userRepositorie from "../repositories/user.repositorie.js";
import { hashPassword, verifyPassword } from "../utils/passwordCriptDecript.js";
import { StatusCodes } from "http-status-codes";
import authMiddleware from "../middlewares/authMiddleware.js";
import AppError from "../utils/error.js";

const register = async (name, email, password, phone, birthDate) => {
  const userExists = await userRepositorie.getUserByEmail(email);
  if (userExists) {
    throw new AppError("User already exists", StatusCodes.CONFLICT);
  }

  const hashedPassword = await hashPassword(password);
  const birthDateISO = new Date(birthDate);

  const user = await userRepositorie.register(
    name,
    email,
    hashedPassword,
    phone,
    birthDateISO
  );
  user.token = await authMiddleware.generateToken(user.id);

  return user;
};

const login = async (email, password) => {
  const user = await userRepositorie.getUserByEmail(email);
  if (!user) {
    throw new AppError("Email or password incorrect", StatusCodes.UNAUTHORIZED);
  }

  const passwordMatch = await verifyPassword(password, user.password);
  if (!passwordMatch) {
    throw new AppError("Email or password incorrect", StatusCodes.UNAUTHORIZED);
  }

  delete user.password;
  user.token = await authMiddleware.generateToken(user.id);

  return user;
};

const getUserById = async (id) => {
  const user = await userRepositorie.getUserById(id);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  return user;
};

const patchUser = async (id, name, email, phone, birthDate) => {
  const user = await userRepositorie.getUserById(id);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const birthDateISO = new Date(birthDate);

  const updatedUser = await userRepositorie.patchUser(
    id,
    name,
    phone,
    birthDateISO
  );
  return updatedUser;
};

export default {
  register,
  login,
  getUserById,
  patchUser,
};
