import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import { registerSchemaBody, loginSchemaBody, patchSchemaBody } from "../schemas/index.js";
import { z } from "zod";

const register = async (request, reply) => {
  try {
    const body = registerSchemaBody.parse(request.body);

    const user = await userService.register(
      body.name,
      body.email,
      body.password
    );

    reply.code(StatusCodes.CREATED).send(user);
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

    if (error.message === "User already exists") {
      return reply.code(StatusCodes.CONFLICT).send({
        error: "Usuário já cadastrado",
      });
    } else {
      return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: "Ocorreu um erro ao registrar o usuário",
      });
    }
  }
};

const login = async (request, reply) => {
  try {
    const body = loginSchemaBody.parse(request.body);

    const user = await userService.login(body.email, body.password);

    reply.send(user);
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

    if (error.message === "Email or password incorrect") {
      return reply.code(StatusCodes.UNAUTHORIZED).send({
        error: "Email ou senha incorretos",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao fazer login",
    });
  }
};

const getUserById = async (request, reply) => {
  try {
    const id = request.params.id;

    const user = await userService.getUserById(id);

    reply.send(user);
  } catch (error) {
    if (error.message === "User not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Usuário não encontrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar o usuário",
    });
  }
};

const patchUser = async (request, reply) => {
  try {
    const id = request.params.id;
    const body = patchSchemaBody.parse(request.body);

    const user = await userService.patchUser(
      id,
      body.name,
      body.email
    );

    reply.send(user);
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
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao atualizar o usuário",
    });
  }
};

const deleteUser = async (request, reply) => {
  try {
    const id = request.params.id;

    await userService.deleteUser(id);

    reply.code(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    if (error.message === "User not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Usuário não encontrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao deletar o usuário",
    });
  }
};

export default {
  register,
  login,
  getUserById,
  patchUser,
  deleteUser,
};
