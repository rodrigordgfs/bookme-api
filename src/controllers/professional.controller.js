import professionalService from "../services/professional.service.js";
import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import {
  patchProfessionalSchemaBody,
  patchProfessionalSchemaParams,
  getProfessionalSchemaParams,
  deleteProfessionalSchemaParams,
  postProfessionalServiceSchemaParams,
  postProfessionalSchemaBody,
  getProfessionalServiceSchemaParams,
  deleteProfessionalServiceSchemaParams,
} from "../schemas/index.js";
import { z } from "zod";

const postProfessional = async (request, reply) => {
  try {
    const { id_user, specialty, hiringDate } = postProfessionalSchemaBody.parse(
      request.body
    );

    await userService.getUserById(id_user);

    const professional = await professionalService.postProfessional(
      id_user,
      specialty,
      hiringDate
    );

    reply.status(StatusCodes.CREATED).send(professional);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: error.errors.map((error) => {
          return {
            message: error.message,
            field: error.path[0],
          };
        }),
      });
    }

    if (error.message === "User not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Usuário não encontrado",
      });
    } else if (error.message === "Professional already exists") {
      return reply.code(StatusCodes.CONFLICT).send({
        error: "Profissional já cadastrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao cadastrar o profissional",
    });
  }
};

const patchProfessional = async (request, reply) => {
  try {
    const { id } = patchProfessionalSchemaParams.parse(request.params);
    const { specialty, hiringDate } = patchProfessionalSchemaBody.parse(
      request.body
    );

    const updatedProfessional = await professionalService.patchProfessional(
      id,
      specialty,
      hiringDate
    );

    reply.send(updatedProfessional);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: error.errors.map((error) => {
          return {
            message: error.message,
            field: error.path[0],
          };
        }),
      });
    }

    if (error.message === "Professional not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Profissional não encontrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao atualizar o profissional",
    });
  }
};

const getProfessionalById = async (request, reply) => {
  try {
    const { id } = getProfessionalSchemaParams.parse(request.params);

    const professional = await professionalService.getProfessionalById(id);

    reply.send(professional);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: error.errors.map((error) => {
          return {
            message: error.message,
            field: error.path[0],
          };
        }),
      });
    }

    if (error.message === "Professional not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Profissional não encontrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar o profissional",
    });
  }
};

const getProfessionals = async (request, reply) => {
  try {
    const professionals = await professionalService.getProfessionals();

    reply.send(professionals);
  } catch (error) {
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar os profissionais",
    });
  }
};

const deleteProfessional = async (request, reply) => {
  try {
    const { id } = deleteProfessionalSchemaParams.parse(request.params);

    await professionalService.deleteProfessional(id);

    reply.code(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: error.errors.map((error) => {
          return {
            message: error.message,
            field: error.path[0],
          };
        }),
      });
    }

    if (error.message === "Professional not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Profissional não encontrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao deletar o profissional",
    });
  }
};

const postProfessionalService = async (request, reply) => {
  try {
    const { id_professional, id_service } =
      postProfessionalServiceSchemaParams.parse(request.params);

    await professionalService.postProfessionalService(
      id_professional,
      id_service
    );

    reply.code(StatusCodes.CREATED).send();
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: error.errors.map((error) => {
          return {
            message: error.message,
            field: error.path[0],
          };
        }),
      });
    }

    if (error.message === "Professional not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Profissional não encontrado",
      });
    } else if (error.message === "Service not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Serviço não encontrado",
      });
    } else if (error.message === "Professional already has this service") {
      return reply.code(StatusCodes.CONFLICT).send({
        error: "Profissional já possui esse serviço",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao adicionar o serviço ao profissional",
    });
  }
};

const getProfessionalServices = async (request, reply) => {
  try {
    const { id_professional } = getProfessionalServiceSchemaParams.parse(
      request.params
    );

    const professionalServices =
      await professionalService.getProfessionalServices(id_professional);

    reply.send(professionalServices);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: error.errors.map((error) => {
          return {
            message: error.message,
            field: error.path[0],
          };
        }),
      });
    }

    if (error.message === "Professional service not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Serviço do profissional não encontrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar o serviço do profissional",
    });
  }
};

const deleteProfessionalService = async (request, reply) => {
  try {
    const { id_professional, id_service } =
      deleteProfessionalServiceSchemaParams.parse(request.params);

    await professionalService.deleteProfessionalService(
      id_professional,
      id_service
    );

    reply.code(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: error.errors.map((error) => {
          return {
            message: error.message,
            field: error.path[0],
          };
        }),
      });
    }

    if (error.message === "Professional not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Profissional não encontrado",
      });
    } else if (error.message === "Service not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Serviço não encontrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao deletar o serviço do profissional",
    });
  }
};

export default {
  postProfessional,
  patchProfessional,
  getProfessionalById,
  getProfessionals,
  deleteProfessional,
  postProfessionalService,
  postProfessionalService,
  getProfessionalServices,
  deleteProfessionalService,
};
