import professionalService from "../services/professional.service.js";
import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const postProfessional = async (request, reply) => {
  try {
    const schemaBody = z.object({
      id_user: z.string().uuid("ID de usuário inválido"),
      specialty: z
        .string()
        .min(2, "Especialidade deve ter pelo menos 2 caracteres"),
      photo: z
        .string()
        .regex(
          /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/,
          "Formato de imagem inválido"
        )
        .optional(),
    });

    const { id_user, specialty, photo } = schemaBody.parse(request.body);

    await userService.getUserById(id_user);

    const professional = await professionalService.postProfessional(
      id_user,
      specialty,
      photo
    );

    reply.status(StatusCodes.CREATED).send(professional);
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
    const schemaParams = z.object({
      id: z.string().uuid("ID de usuário inválido"),
    });

    const schemaBody = z.object({
      specialty: z
        .string()
        .min(2, "Especialidade deve ter pelo menos 2 caracteres"),
      photo: z
        .string()
        .optional()
        .refine(
          (photo) => {
            const urlPattern =
              /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            const base64Pattern =
              /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/;
            return urlPattern.test(photo) || base64Pattern.test(photo);
          },
          {
            message:
              "A foto deve ser uma URL ou uma string base64 válida no formato JPG ou PNG",
          }
        ),
    });

    const { id } = schemaParams.parse(request.params);
    const { specialty, photo } = schemaBody.parse(request.body);

    const updatedProfessional = await professionalService.patchProfessional(
      id,
      specialty,
      photo
    );

    reply.send(updatedProfessional);
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
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao atualizar o profissional",
    });
  }
};

const getProfessionalById = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid("ID de usuário inválido"),
    });

    const { id } = schemaParams.parse(request.params);

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
    const schemaQuery = z.object({
      services: z
        .union([z.boolean(), z.string()])
        .optional()
        .transform((value) => value === "true" || value === true),
    });

    const { services } = schemaQuery.parse(request.query);

    const professionals = await professionalService.getProfessionals(services);

    reply.send(professionals);
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

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar os profissionais",
    });
  }
};

const deleteProfessional = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid("ID de usuário inválido"),
    });

    const { id } = schemaParams.parse(request.params);

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
    const schemaParams = z.object({
      id_professional: z.string().uuid("Id do usuário deve ser um UUID"),
      id_service: z.string().uuid("Id do serviço deve ser um UUID"),
    });

    const { id_professional, id_service } = schemaParams.parse(request.params);

    const service = await professionalService.postProfessionalService(
      id_professional,
      id_service
    );

    reply.code(StatusCodes.CREATED).send(service);
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
    const schemaParams = z.object({
      id_professional: z.string().uuid("ID de usuário inválido"),
    });

    const { id_professional } = schemaParams.parse(request.params);

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
    const schemaParams = z.object({
      id_professional: z.string().uuid("ID de usuário inválido"),
      id_service: z.string().uuid("ID de serviço inválido"),
    });

    const { id_professional, id_service } = schemaParams.parse(request.params);

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
