import professionalRepositorie from "../repositories/professional.repositorie.js";
import serviceRepositorie from "../repositories/service.repositorie.js";
import userRepositorie from "../repositories/user.repositorie.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error.js";
import { isBase64 } from "../utils/isBase64.js";

const postProfessional = async (id_user, specialty, photo) => {
  const userExists = await userRepositorie.getUserById(id_user);
  if (!userExists) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const professionalExists =
    await professionalRepositorie.getProfessionalByUserId(id_user);
  if (professionalExists) {
    throw new AppError("Professional already exists", StatusCodes.CONFLICT);
  }


  const professional = await professionalRepositorie.postProfessional(
    id_user,
    specialty
  );

  const photoUrl = await professionalRepositorie.uploadProfissionalImage(professional.id, photo)

  return {
    ...professional,
    photoUrl
  };
};

const patchProfessional = async (id, specialty, photo) => {
  const professional = await professionalRepositorie.getProfessionalById(id);
  if (!professional) {
    throw new AppError("Professional not found", StatusCodes.NOT_FOUND);
  }

  let newPhoto = null
  if (isBase64(photo)) {
    newPhoto = await professionalRepositorie.updatedProfessional(professional.id, photo)
  }

  const updatedProfessional = await professionalRepositorie.patchProfessional(
    id,
    specialty,
    newPhoto ? newPhoto : professional.photoUrl
  );

  return updatedProfessional;
};

const getProfessionalById = async (id) => {
  const professional = await professionalRepositorie.getProfessionalById(id);
  if (!professional) {
    throw new AppError("Professional not found", StatusCodes.NOT_FOUND);
  }
  return professional;
};

const getProfessionals = async (services) => {
  const professionals = await professionalRepositorie.getProfessionals(services);
  return professionals;
};

const deleteProfessional = async (id) => {
  const professional = await professionalRepositorie.getProfessionalById(id);
  if (!professional) {
    throw new AppError("Professional not found", StatusCodes.NOT_FOUND);
  }
  await professionalRepositorie.deleteProfessional(id);
};

const postProfessionalService = async (id_professional, id_service) => {
  const professional = await professionalRepositorie.getProfessionalById(
    id_professional
  );
  if (!professional) {
    throw new AppError("Professional not found", StatusCodes.NOT_FOUND);
  }

  const service = await serviceRepositorie.getServiceById(id_service);
  if (!service) {
    throw new AppError("Service not found", StatusCodes.NOT_FOUND);
  }

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

  const professionalService =
    await professionalRepositorie.postProfessionalService(
      id_professional,
      id_service
    );
  return professionalService;
};

const getProfessionalServices = async (id_professional) => {
  const professionalExists = await professionalRepositorie.getProfessionalById(
    id_professional
  );
  if (!professionalExists) {
    throw new AppError("Professional not found", StatusCodes.NOT_FOUND);
  }

  const professionalService = await professionalRepositorie.getProfessionalServiceByIdProfessional(id_professional);
  return professionalService;
};

const deleteProfessionalService = async (id_professional, id_service) => {
  const professional = await professionalRepositorie.getProfessionalById(
    id_professional
  );
  
  if (!professional) {
    throw new AppError("Professional not found", StatusCodes.NOT_FOUND);
  }

  const service = await serviceRepositorie.getServiceById(id_service);
  if (!service) {
    throw new AppError("Service not found", StatusCodes.NOT_FOUND);
  }

  const professionalService = await professionalRepositorie.getProfessionalServiceByIdProfessionalIdService(
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
}

export default {
  postProfessional,
  patchProfessional,
  getProfessionalById,
  getProfessionals,
  deleteProfessional,
  postProfessionalService,
  getProfessionalServices,
  deleteProfessionalService
};
