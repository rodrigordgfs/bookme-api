import { prisma } from "../libs/prisma.js";

const register = async (name, email, password) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const patchUser = async (id, name) => {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name
      },
      select: {
        id: true,
        name: true,
        email: true
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  register,
  getUserByEmail,
  getUserById,
  patchUser,
  deleteUser,
};
