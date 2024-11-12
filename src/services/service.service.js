import serviceRepositorie from "../repositories/service.repositorie.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error.js";

const checkServiceExists = async (id) => {
  const service = await serviceRepositorie.getServiceById(id);
  if (!service) {
    throw new AppError("Service not found", StatusCodes.NOT_FOUND);
  }
  return service;
};

const postService = async (name, description, duration, price) => {
  return await serviceRepositorie.postService(
    name,
    description,
    duration,
    price
  );
};

const patchService = async (id, name, description, duration, price) => {
  await checkServiceExists(id);
  return await serviceRepositorie.patchService(
    id,
    name,
    description,
    duration,
    price
  );
};

const getServiceById = async (id) => {
  return await checkServiceExists(id);
};

const getServices = async () => {
  return await serviceRepositorie.getServices();
};

const deleteService = async (id) => {
  await checkServiceExists(id);
  await serviceRepositorie.deleteService(id);
};

export default {
  postService,
  patchService,
  getServiceById,
  getServices,
  deleteService,
};
