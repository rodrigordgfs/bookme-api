import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const register = async (request, reply) => {
  try {
    const schemaBody = z.object({
      name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
      email: z.string().email("E-mail inválido"),
      password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    });

    const body = schemaBody.parse(request.body);

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
    const schemaBody = z.object({
      email: z.string().email("E-mail inválido"),
      password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    });

    const body = schemaBody.parse(request.body);

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
    const schemaParams = z.object({
      id: z.string().uuid("ID deve ser um UUID"),
    });

    const { id } = schemaParams.parse(request.params);

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

const getUsers = async (request, reply) => {
  try {
    const users = await userService.getUsers();

    reply.send(users);
  } catch (error) {
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar os usuários",
    });
  }
};

const patchUser = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid("ID deve ser um UUID"),
    });

    const schemaBody = z.object({
      name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    });

    const { id } = schemaParams.parse(request.params);
    const { name, email } = schemaBody.parse(request.body);

    const user = await userService.patchUser(id, name, email);

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
    const schemaParams = z.object({
      id: z.string().uuid("ID deve ser um UUID"),
    });

    const { id } = schemaParams.parse(request.params);

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
  getUsers,
};
