import { prisma } from "../libs/prisma.js";

const clientSelectFields = {
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
  photo: true,
  createdAt: true,
  updatedAt: true,
};

const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

const postClient = async (id_user, phone, birthDate, gender, photo) => {
  try {
    return await prisma.client.create({
      data: {
        user: { connect: { id: id_user } },
        phone,
        birthDate,
        gender,
        photo,
      },
      select: clientSelectFields,
    });
  } catch (error) {
    handleError(error, "Erro ao criar cliente");
  }
};

const patchClient = async (id, phone, birthDate, gender, photo) => {
  try {
    return await prisma.client.update({
      where: { id },
      data: { phone, birthDate, gender, photo },
      select: clientSelectFields,
    });
  } catch (error) {
    handleError(error, "Erro ao atualizar cliente");
  }
};

const getClients = async (name, email, phone, page, perPage) => {
  try {
    const conditions = [
      name
        ? { user: { name: { contains: name, mode: "insensitive" } } }
        : undefined,
      email ? { email: { contains: email, mode: "insensitive" } } : undefined,
      phone ? { phone: { contains: phone, mode: "insensitive" } } : undefined,
    ].filter(Boolean);

    const skip = (Math.max(page, 1) - 1) * Math.max(perPage, 1);

    const totalItems = await prisma.client.count({
      where: conditions.length > 0 ? { OR: conditions } : undefined,
    });

    const totalPages = Math.ceil(totalItems / perPage);

    const clients = await prisma.client.findMany({
      select: clientSelectFields,
      where: conditions.length > 0 ? { OR: conditions } : undefined,
      skip,
      take: perPage
    });

    return {
      clients,
      totalPages,
      currentPage: page,
      totalItems,
    };
  } catch (error) {
    handleError(error, "Erro ao obter lista de clientes");
  }
};


const getClientById = async (id) => {
  try {
    return await prisma.client.findUnique({
      where: { id },
      select: clientSelectFields,
    });
  } catch (error) {
    handleError(error, "Erro ao obter cliente por ID");
  }
};

const getClientByUserId = async (id_user) => {
  try {
    return await prisma.client.findFirst({
      where: { user: { id: id_user } },
      select: clientSelectFields,
    });
  } catch (error) {
    handleError(error, "Erro ao obter cliente por ID do usuário");
  }
};

const deleteClient = async (id) => {
  try {
    return await prisma.client.delete({ where: { id } });
  } catch (error) {
    handleError(error, "Erro ao deletar cliente");
  }
};

export default {
  postClient,
  patchClient,
  getClients,
  getClientById,
  getClientByUserId,
  deleteClient
};
