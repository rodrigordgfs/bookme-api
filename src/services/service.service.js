import serviceRepositorie from "../repositories/service.repositorie.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error.js";

const postService = async (name, description, duration, price) => {
  const service = await serviceRepositorie.postService(
    name,
    description,
    duration,
    price
  );
  return service;
};

const patchService = async (id, name, description, duration, price) => {
  const serviceExists = await serviceRepositorie.getServiceById(id);
  if (!serviceExists) {
    throw new AppError("Service not found", StatusCodes.NOT_FOUND);
  }

  const service = await serviceRepositorie.patchService(
    id,
    name,
    description,
    duration,
    price
  );
  return service;
};

const getServiceById = async (id) => {
  const service = await serviceRepositorie.getServiceById(id);
  if (!service) {
    throw new AppError("Service not found", StatusCodes.NOT_FOUND);
  }
  return service;
};

const getServices = async () => {
  const services = await serviceRepositorie.getServices();
  return services;
};

const deleteService = async (id) => {
  const serviceExists = await serviceRepositorie.getServiceById(id);
  if (!serviceExists) {
    throw new AppError("Service not found", StatusCodes.NOT_FOUND);
  }

  await serviceRepositorie.deleteService(id);
};

export default {
  postService,
  patchService,
  getServiceById,
  getServices,
  deleteService,
};
