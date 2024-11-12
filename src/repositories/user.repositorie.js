import { prisma } from "../libs/prisma.js";

const USER_SELECT_FIELDS = {
  id: true,
  name: true,
  email: true,
  password: true,
};

const logError = (error) => {
  console.error("Database Error:", error);
  throw new Error("An unexpected error occurred. Please try again.");
};

const register = async (name, email, password) => {
  try {
    const user = await prisma.user.create({
      data: { name, email, password },
      select: { id: true, name: true, email: true },
    });
    return user;
  } catch (error) {
    logError(error);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: USER_SELECT_FIELDS,
    });
    return user;
  } catch (error) {
    logError(error);
  }
};

const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
    return users;
  } catch (error) {
    logError(error);
  }
};

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: USER_SELECT_FIELDS,
    });
    return user;
  } catch (error) {
    logError(error);
  }
};

const patchUser = async (id, name) => {
  try {
    const updateData = {};
    if (name) updateData.name = name;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true },
    });
    return user;
  } catch (error) {
    logError(error);
  }
};

const deleteUser = async (id) => {
  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    return user;
  } catch (error) {
    logError(error);
  }
};

export default {
  register,
  getUserByEmail,
  getUserById,
  patchUser,
  deleteUser,
  getUsers,
};
