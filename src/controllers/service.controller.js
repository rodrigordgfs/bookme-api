import serviceService from "../services/service.service.js";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const postService = async (request, reply) => {
  try {
    const schemaBody = z.object({
      name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
      description: z
        .string()
        .min(2, "Descrição deve ter pelo menos 2 caracteres"),
      duration: z
        .number()
        .int()
        .positive("Duração deve ser um número positivo"),
      price: z.number().int().positive("Preço deve ser um número positivo"),
    });

    const { name, description, duration, price } = schemaBody.parse(
      request.body
    );

    const service = await serviceService.postService(
      name,
      description,
      duration,
      price
    );

    reply.status(StatusCodes.CREATED).send(service);
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
      error: "Ocorreu um erro ao cadastrar o serviço",
    });
  }
};

const patchService = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid("ID deve ser um UUID"),
    });

    const schemaBody = z.object({
      name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
      description: z
        .string()
        .min(2, "Descrição deve ter pelo menos 2 caracteres"),
      duration: z
        .number()
        .int()
        .positive("Duração deve ser um número positivo"),
      price: z.number().int().positive("Preço deve ser um número positivo"),
    });

    const { id } = schemaParams.parse(request.params);
    const { name, description, duration, price } = schemaBody.parse(
      request.body
    );

    const service = await serviceService.patchService(
      id,
      name,
      description,
      duration,
      price
    );

    reply.send(service);
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

    if (error.message === "Service not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Serviço não encontrado",
      });
    } else {
      reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: "Ocorreu um erro ao atualizar o serviço",
      });
    }
  }
};

const getServiceById = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid("ID deve ser um UUID"),
    });
    const { id } = schemaParams.parse(request.params);

    const service = await serviceService.getServiceById(id);

    reply.send(service);
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

    if (error.message === "Service not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Serviço não encontrado",
      });
    } else {
      reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: "Ocorreu um erro ao buscar o serviço",
      });
    }
  }
};

const getServices = async (request, reply) => {
  try {
    const services = await serviceService.getServices();

    reply.send(services);
  } catch (error) {
    console.log(error);
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar os serviços",
    });
  }
};

const deleteService = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid("ID deve ser um UUID"),
    });

    const { id } = schemaParams.parse(request.params);

    await serviceService.deleteService(id);

    reply.send().status(StatusCodes.NO_CONTENT);
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

    if (error.message === "Service not found") {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Serviço não encontrado",
      });
    } else {
      reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: "Ocorreu um erro ao deletar o serviço",
      });
    }
  }
};

export default {
  postService,
  patchService,
  getServiceById,
  getServices,
  deleteService,
};
