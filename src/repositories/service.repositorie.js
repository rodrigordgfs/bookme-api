import { prisma } from "../libs/prisma.js";

const postService = async (name, description, duration, price) => {
  try {
    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration,
        price,
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return service;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const patchService = async (id, name, description, duration, price) => {
  try {
    const service = await prisma.service.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        duration,
        price,
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return service;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const getServiceById = async (id) => {
  try {
    const service = await prisma.service.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return service;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getServices = async () => {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return services;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const deleteService = async (id) => {
  try {
    const service = await prisma.service.delete({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return service;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default {
  postService,
  patchService,
  getServiceById,
  getServices,
  deleteService,
};
