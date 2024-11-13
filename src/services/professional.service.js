import professionalRepositorie from "../repositories/professional.repositorie.js";
import serviceRepositorie from "../repositories/service.repositorie.js";
import userRepositorie from "../repositories/user.repositorie.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error.js";
import { isBase64 } from "../utils/isBase64.js";

const findProfessionalById = async (id) => {
  const professional = await professionalRepositorie.getProfessionalById(id);
  if (!professional) {
    throw new AppError("Professional not found", StatusCodes.NOT_FOUND);
  }
  return professional;
};

const findServiceById = async (id) => {
  const service = await serviceRepositorie.getServiceById(id);
  if (!service) {
    throw new AppError("Service not found", StatusCodes.NOT_FOUND);
  }
  return service;
};

const checkProfessionalExists = async (id_user) => {
  const professionalExists =
    await professionalRepositorie.getProfessionalByUserId(id_user);
  if (professionalExists) {
    throw new AppError("Professional already exists", StatusCodes.CONFLICT);
  }
};

const postProfessional = async (id_user, specialty, photo) => {
  const userExists = await userRepositorie.getUserById(id_user);
  if (!userExists) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  await checkProfessionalExists(id_user);

  const professional = await professionalRepositorie.postProfessional(
    id_user,
    specialty
  );
  const photoUrl =
    photo && isBase64(photo)
      ? await professionalRepositorie.uploadProfissionalImage(
          professional.id,
          photo
        )
      : null;

  return {
    ...professional,
    photoUrl,
  };
};

const patchProfessional = async (id, specialty, photo) => {
  const professional = await findProfessionalById(id);

  let newPhoto = null;
  if (photo && isBase64(photo)) {
    newPhoto = await professionalRepositorie.updatedProfessional(
      professional.id,
      photo
    );
  }

  const updatedProfessional = await professionalRepositorie.patchProfessional(
    id,
    specialty,
    newPhoto ? newPhoto : professional.photoUrl
  );

  return updatedProfessional;
};

const getProfessionalById = async (id) => {
  return await findProfessionalById(id);
};

const getProfessionals = async (services, name, email, specialty) => {
  return await professionalRepositorie.getProfessionals(services, name, email, specialty);
};

const deleteProfessional = async (id) => {
  await findProfessionalById(id);
  await professionalRepositorie.deleteProfessional(id);
};

const postProfessionalService = async (id_professional, id_service) => {
  await findProfessionalById(id_professional);
  await findServiceById(id_service);

  const professionalServiceExists =
    await professionalRepositorie.getProfessionalServiceByIdProfessionalIdService(
      id_professional,
      id_service
    );
  if (professionalServiceExists) {
    throw new AppError(
      "Professional service already exists",
      StatusCodes.CONFLICT
    );
  }

  return await professionalRepositorie.postProfessionalService(
    id_professional,
    id_service
  );
};

const getProfessionalServices = async (id_professional) => {
  await findProfessionalById(id_professional);
  return await professionalRepositorie.getProfessionalServiceByIdProfessional(
    id_professional
  );
};

const deleteProfessionalService = async (id_professional, id_service) => {
  await findProfessionalById(id_professional);
  await findServiceById(id_service);

  const professionalService =
    await professionalRepositorie.getProfessionalServiceByIdProfessionalIdService(
      id_professional,
      id_service
    );
  if (!professionalService) {
    throw new AppError("Professional service not found", StatusCodes.NOT_FOUND);
  }

  await professionalRepositorie.deleteProfessionalService(
    id_professional,
    id_service
  );
};

export default {
  postProfessional,
  patchProfessional,
  getProfessionalById,
  getProfessionals,
  deleteProfessional,
  postProfessionalService,
  getProfessionalServices,
  deleteProfessionalService,
};
