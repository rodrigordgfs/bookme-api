import serviceService from "../services/service.service.js";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().min(2, "Descrição deve ter pelo menos 2 caracteres"),
  duration: z.number().int().positive("Duração deve ser um número positivo"),
  price: z.number().int().positive("Preço deve ser um número positivo"),
});

const idSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID"),
});

const formatZodErrors = (errors) => {
  return errors.map((error) => ({
    message: error.message,
    field: error.path[0],
  }));
};

const postService = async (request, reply) => {
  try {
    const data = serviceSchema.parse(request.body);
    const service = await serviceService.postService(data);

    reply.status(StatusCodes.CREATED).send(service);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: formatZodErrors(error.errors),
      });
    }
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao cadastrar o serviço",
    });
  }
};

const patchService = async (request, reply) => {
  try {
    const { id } = idSchema.parse(request.params);
    const data = serviceSchema.parse(request.body);

    const service = await serviceService.patchService(id, data);

    if (!service) {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Serviço não encontrado",
      });
    }

    reply.send(service);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: formatZodErrors(error.errors),
      });
    }
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao atualizar o serviço",
    });
  }
};

const getServiceById = async (request, reply) => {
  try {
    const { id } = idSchema.parse(request.params);
    const service = await serviceService.getServiceById(id);

    if (!service) {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Serviço não encontrado",
      });
    }

    reply.send(service);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: formatZodErrors(error.errors),
      });
    }
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar o serviço",
    });
  }
};

const getServices = async (_, reply) => {
  try {
    const services = await serviceService.getServices();
    reply.send(services);
  } catch (error) {
    console.error(error);
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao buscar os serviços",
    });
  }
};

const deleteService = async (request, reply) => {
  try {
    const { id } = idSchema.parse(request.params);

    const deleted = await serviceService.deleteService(id);

    if (!deleted) {
      return reply.code(StatusCodes.NOT_FOUND).send({
        error: "Serviço não encontrado",
      });
    }

    reply.code(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return reply.code(StatusCodes.BAD_REQUEST).send({
        error: formatZodErrors(error.errors),
      });
    }
    reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: "Ocorreu um erro ao deletar o serviço",
    });
  }
};

export default {
  postService,
  patchService,
  getServiceById,
  getServices,
  deleteService,
};
