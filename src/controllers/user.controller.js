import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const handleErrorResponse = (error, reply) => {
  if (error instanceof z.ZodError) {
    return reply.code(StatusCodes.BAD_REQUEST).send({
      error: error.errors.map(({ message, path }) => ({
        message,
        field: path[0],
      })),
    });
  }

  const errorMessages = {
    "User already exists": StatusCodes.CONFLICT,
    "Email or password incorrect": StatusCodes.UNAUTHORIZED,
    "User not found": StatusCodes.NOT_FOUND,
  };

  const statusCode =
    errorMessages[error.message] || StatusCodes.INTERNAL_SERVER_ERROR;
  reply.code(statusCode).send({
    error: error.message || "Ocorreu um erro interno",
  });
};

const register = async (request, reply) => {
  try {
    const schema = z.object({
      name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
      email: z.string().email("E-mail inválido"),
      password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    });
    const { name, email, password } = schema.parse(request.body);

    const user = await userService.register(name, email, password);
    reply.code(StatusCodes.CREATED).send(user);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const login = async (request, reply) => {
  try {
    const schema = z.object({
      email: z.string().email("E-mail inválido"),
      password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    });
    const { email, password } = schema.parse(request.body);

    const user = await userService.login(email, password);
    reply.send(user);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const getUserById = async (request, reply) => {
  try {
    const { id } = z
      .object({ id: z.string().uuid("ID deve ser um UUID") })
      .parse(request.params);

    const user = await userService.getUserById(id);
    reply.send(user);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const getUsers = async (request, reply) => {
  try {
    const users = await userService.getUsers();
    reply.send(users);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const patchUser = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid("ID deve ser um UUID"),
    });
    const schemaBody = z.object({
      name: z
        .string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .optional(),
      email: z.string().email("E-mail inválido").optional(),
    });

    const { id } = schemaParams.parse(request.params);
    const { name, email } = schemaBody.parse(request.body);

    const user = await userService.patchUser(id, name, email);
    reply.send(user);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const deleteUser = async (request, reply) => {
  try {
    const { id } = z
      .object({ id: z.string().uuid("ID deve ser um UUID") })
      .parse(request.params);

    await userService.deleteUser(id);
    reply.code(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  register,
  login,
  getUserById,
  getUsers,
  patchUser,
  deleteUser,
};
