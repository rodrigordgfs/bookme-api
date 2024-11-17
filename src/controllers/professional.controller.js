import professionalService from "../services/professional.service.js";
import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const idSchema = z.string().uuid("ID inválido");
const specialtySchema = z
  .string()
  .min(2, "Especialidade deve ter pelo menos 2 caracteres");

const photoSchema = z
  .string()
  .regex(
    /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/,
    "Formato de imagem inválido"
  )
  .optional();

const urlOrBase64Schema = z
  .string()
  .optional()
  .refine(
    (photo) => {
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      const base64Pattern = /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/;
      return urlPattern.test(photo) || base64Pattern.test(photo);
    },
    {
      message:
        "A foto deve ser uma URL ou uma string base64 válida no formato JPG ou PNG",
    }
  );

const handleError = (error, reply) => {
  console.log(error);
  if (error instanceof z.ZodError) {
    return reply.code(StatusCodes.BAD_REQUEST).send({
      error: error.errors.map((e) => ({
        message: e.message,
        field: e.path[0],
      })),
    });
  }

  if (error.message === "User not found") {
    return reply
      .code(StatusCodes.NOT_FOUND)
      .send({ error: "Usuário não encontrado" });
  } else if (error.message === "Professional not found") {
    return reply
      .code(StatusCodes.NOT_FOUND)
      .send({ error: "Profissional não encontrado" });
  } else if (error.message === "Professional already exists") {
    return reply
      .code(StatusCodes.CONFLICT)
      .send({ error: "Profissional já cadastrado" });
  }

  reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
    error: "Ocorreu um erro interno",
  });
};

const postProfessional = async (request, reply) => {
  try {
    const schemaBody = z.object({
      id_user: idSchema,
      specialty: specialtySchema,
      photo: photoSchema,
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
    handleError(error, reply);
  }
};

const patchProfessional = async (request, reply) => {
  try {
    const schemaParams = z.object({ id: idSchema });
    const schemaBody = z.object({
      specialty: specialtySchema,
      photo: urlOrBase64Schema,
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
    handleError(error, reply);
  }
};

const getProfessionalById = async (request, reply) => {
  try {
    const { id } = z.object({ id: idSchema }).parse(request.params);
    const professional = await professionalService.getProfessionalById(id);
    reply.send(professional);
  } catch (error) {
    handleError(error, reply);
  }
};

const getProfessionals = async (request, reply) => {
  try {
    const schemaQuery = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      specialty: z.string().optional(),
      services: z
        .union([z.boolean(), z.string()])
        .optional()
        .transform((val) => val === "true" || val === true),
      page: z
        .string()
        .optional()
        .default("1")
        .transform((value) => parseInt(value)),
      perPage: z
        .string()
        .optional()
        .default("10")
        .transform((value) => parseInt(value)),
    });

    const { services, name, email, specialty, page, perPage } =
      schemaQuery.parse(request.query);

    const { profissionals, totalPages, currentPage, totalItems } =
      await professionalService.getProfessionals(
        services,
        name,
        email,
        specialty,
        page,
        perPage
      );

    reply
      .status(StatusCodes.OK)
      .send({
        totalPages,
        currentPage,
        totalItems,
        data: profissionals,
      });
  } catch (error) {
    handleError(error, reply);
  }
};

const deleteProfessional = async (request, reply) => {
  try {
    const { id } = z.object({ id: idSchema }).parse(request.params);
    await professionalService.deleteProfessional(id);
    reply.code(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    handleError(error, reply);
  }
};

const postProfessionalService = async (request, reply) => {
  try {
    const { id_professional, id_service } = z
      .object({
        id_professional: idSchema,
        id_service: idSchema,
      })
      .parse(request.params);

    const service = await professionalService.postProfessionalService(
      id_professional,
      id_service
    );
    reply.code(StatusCodes.CREATED).send(service);
  } catch (error) {
    handleError(error, reply);
  }
};

const getProfessionalServices = async (request, reply) => {
  try {
    const { id_professional } = z
      .object({ id_professional: idSchema })
      .parse(request.params);
    const professionalServices =
      await professionalService.getProfessionalServices(id_professional);
    reply.send(professionalServices);
  } catch (error) {
    handleError(error, reply);
  }
};

const deleteProfessionalService = async (request, reply) => {
  try {
    const { id_professional, id_service } = z
      .object({
        id_professional: idSchema,
        id_service: idSchema,
      })
      .parse(request.params);

    await professionalService.deleteProfessionalService(
      id_professional,
      id_service
    );
    reply.code(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    handleError(error, reply);
  }
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
