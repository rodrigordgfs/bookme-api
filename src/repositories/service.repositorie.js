import { prisma } from "../libs/prisma.js";

const SERVICE_SELECT_FIELDS = {
  id: true,
  name: true,
  description: true,
  duration: true,
  price: true,
  createdAt: true,
  updatedAt: true,
};

const logError = (error) => {
  console.error("Database Error:", error);
  throw new Error("An unexpected error occurred. Please try again.");
};

const postService = async (name, description, duration, price) => {
  try {
    console.log({ name, description, duration, price });
    return await prisma.service.create({
      data: {
        description,
        duration,
        name,
        price,
      },
      select: SERVICE_SELECT_FIELDS,
    });
  } catch (error) {
    logError(error);
  }
};

const patchService = async (id, name, description, duration, price) => {
  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (duration) updateData.duration = duration;
    if (price) updateData.price = price;

    return await prisma.service.update({
      where: { id },
      data: updateData,
      select: SERVICE_SELECT_FIELDS,
    });
  } catch (error) {
    logError(error);
  }
};

const getServiceById = async (id) => {
  try {
    return await prisma.service.findUnique({
      where: { id },
      select: SERVICE_SELECT_FIELDS,
    });
  } catch (error) {
    logError(error);
  }
};

const getServices = async (name, price, duration, page = 1, perPage = 10) => {
  try {
    const conditions = [
      name ? { name: { contains: name, mode: "insensitive" } } : undefined,
      price ? { price: price } : undefined,
      duration ? { duration: duration } : undefined,
    ].filter(Boolean);

    const skip = (Math.max(page, 1) - 1) * Math.max(perPage, 1);

    const totalItems = await prisma.professional.count({
      where: conditions.length > 0 ? { OR: conditions } : undefined,
    });

    const totalPages = Math.ceil(totalItems / perPage);

    const services = await prisma.service.findMany({
      select: SERVICE_SELECT_FIELDS,
      where: conditions.length > 0 ? { OR: conditions } : undefined,
      skip,
      take: perPage,
    });

    return {
      services,
      totalPages,
      currentPage: page,
      totalItems,
    };
  } catch (error) {
    logError(error);
  }
};

const deleteService = async (id) => {
  try {
    return await prisma.service.delete({
      where: { id },
      select: SERVICE_SELECT_FIELDS,
    });
  } catch (error) {
    logError(error);
  }
};

export default {
  postService,
  patchService,
  getServiceById,
  getServices,
  deleteService,
};
