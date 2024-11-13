import clientService from "../services/client.service.js";
import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const handleErrorResponse = (error, reply) => {
  if (error instanceof z.ZodError) {
    const errors = error.errors.map(({ message, path }) => ({
      message,
      field: path[0],
    }));
    return reply.code(StatusCodes.BAD_REQUEST).send({ error: errors });
  }

  const errorMessages = {
    "User not found": StatusCodes.NOT_FOUND,
    "Client already exists": StatusCodes.CONFLICT,
    "Client not found": StatusCodes.NOT_FOUND,
  };
  const statusCode =
    errorMessages[error.message] || StatusCodes.INTERNAL_SERVER_ERROR;

  return reply.code(statusCode).send({
    error: error.message || "Ocorreu um erro interno",
  });
};

const schemaBodyCommon = z.object({
  phone: z.string().min(10, "Telefone inválido").max(11, "Telefone inválido"),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de nascimento inválida",
  }),
  gender: z.enum(["M", "F", "O"], "Gênero inválido"),
  photo: z
    .string()
    .regex(
      /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/,
      "Formato de imagem inválido"
    )
    .optional(),
});

const postClient = async (request, reply) => {
  try {
    const schemaBody = schemaBodyCommon.extend({
      id_user: z.string().uuid("ID de usuário inválido"),
    });
    const { id_user, phone, birthDate, gender, photo } = schemaBody.parse(
      request.body
    );

    await userService.getUserById(id_user);
    const client = await clientService.postClient(
      id_user,
      phone,
      birthDate,
      gender,
      photo
    );

    reply.status(StatusCodes.CREATED).send(client);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const patchClient = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid("ID de cliente inválido"),
    });
    const schemaBody = schemaBodyCommon.extend({
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
    const { phone, birthDate, gender, photo } = schemaBody.parse(request.body);

    await clientService.getClientById(id);
    const client = await clientService.patchClient(
      id,
      phone,
      new Date(birthDate),
      gender,
      photo
    );

    reply.status(StatusCodes.OK).send(client);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const getClients = async (request, reply) => {
  try {
    const schemaQuery = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    });

    const { name, email, phone } = schemaQuery.parse(request.query);

    console.log(name, email, phone);

    const clients = await clientService.getClients(name, email, phone);
    reply.status(StatusCodes.OK).send(clients);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const getClientById = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid("ID de cliente inválido"),
    });
    const { id } = schemaParams.parse(request.params);

    const client = await clientService.getClientById(id);
    reply.status(StatusCodes.OK).send(client);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const deleteClient = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid("ID de cliente inválido"),
    });
    const { id } = schemaParams.parse(request.params);

    await clientService.getClientById(id);
    await clientService.deleteClient(id);

    reply.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  postClient,
  patchClient,
  getClients,
  getClientById,
  deleteClient,
};
