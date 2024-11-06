import { prisma } from "../libs/prisma.js";

const postClient = async (id_user, phone, birthDate, gender) => {
  try {
    const client = await prisma.client.create({
      data: {
        user: {
          connect: { id: id_user },
        },
        phone,
        birthDate,
        gender,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        phone: true,
        birthDate: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const patchClient = async (id, phone, birthDate, gender) => {
  try {
    const client = await prisma.client.update({
      where: {
        id
      },
      data: {
        phone,
        birthDate,
        gender,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        phone: true,
        birthDate: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getClients = async () => {
  try {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        phone: true,
        birthDate: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return clients;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getClientById = async (id) => {
  try {
    const client = await prisma.client.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        phone: true,
        birthDate: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getClientByUserId = async (id_user) => {
  try {
    const client = await prisma.client.findFirst({
      where: {
        user: {
          id: id_user,
        }
      }
    });
    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteClient = async (id) => {
  try {
    return await prisma.client.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  postClient,
  patchClient,
  getClients,
  getClientById,
  deleteClient,
  getClientByUserId,
};
