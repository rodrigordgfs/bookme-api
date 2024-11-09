import clientService from "../services/client.service.js";
import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import {
  postClientSchemaBody,
  patchClientSchemaBody,
  getClientSchemaParams,
  deleteClientSchemaParams,
} from "../schemas/index.js";

const postClient = async (request, reply) => {
  try {
    const { id_user, phone, birthDate, gender, photo } =
      postClientSchemaBody.parse(request.body);

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
    } else if (error.message === "Client already exists") {
      return reply.code(StatusCodes.CONFLICT).send({
        error: "Cliente já cadastrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao cadastrar o cliente",
    });
  }
};

const patchClient = async (request, reply) => {
  try {
    const { id } = getClientSchemaParams.parse(request.params);
    const { phone, birthDate, gender, photo } = patchClientSchemaBody.parse(
      request.body
    );

    await clientService.getClientById(id);

    const birthDateISO = new Date(birthDate);

    const client = await clientService.patchClient(
      id,
      phone,
      birthDateISO,
      gender,
      photo
    );

    reply.send(client).status(StatusCodes.OK);
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

    if (error.message === "Client not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Cliente não encontrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao atualizar o cliente",
    });
  }
};

const getClients = async (request, reply) => {
  try {
    const clients = await clientService.getClients();
    reply.send(clients).status(StatusCodes.OK);
  } catch (error) {
    console.log(error);
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar os clientes",
    });
  }
};

const getClientById = async (request, reply) => {
  try {
    const { id } = getClientSchemaParams.parse(request.params);

    const client = await clientService.getClientById(id);

    reply.send(client).status(StatusCodes.OK);
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

    if (error.message === "Client not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Cliente não encontrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar o cliente",
    });
  }
};

const deleteClient = async (request, reply) => {
  try {
    const { id } = deleteClientSchemaParams.parse(request.params);

    await clientService.getClientById(id);

    await clientService.deleteClient(id);

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

    if (error.message === "Client not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Cliente não encontrado",
      });
    }

    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao deletar o cliente",
    });
  }
};

export default {
  postClient,
  patchClient,
  getClients,
  getClientById,
  deleteClient,
};
