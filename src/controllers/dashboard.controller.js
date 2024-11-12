import dashboardService from "../services/dashboard.service.js";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

const handleErrorResponse = (error, reply, defaultMessage) => {
  console.log(error);
  if (error instanceof z.ZodError) {
    return reply.code(StatusCodes.BAD_REQUEST).send({
      error: error.errors.map((err) => ({
        message: err.message,
        field: err.path[0],
      })),
    });
  }

  return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
    error: defaultMessage || "Ocorreu um erro interno",
  });
};

const periodSchemaQuery = z.object({
  start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de início inválida",
  }),
  end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de fim inválida",
  }),
});

const getDashboardTotalMonth = async (request, reply) => {
  try {
    const dashboard = await dashboardService.getTotalMonth();
    reply.status(StatusCodes.OK).send(dashboard);
  } catch (error) {
    handleErrorResponse(
      error,
      reply,
      "Ocorreu um erro ao buscar os dados do mês"
    );
  }
};

const getDashboardAppointmentsMonth = async (request, reply) => {
  try {
    const appointments = await dashboardService.getAppointmentsMonth();
    reply.status(StatusCodes.OK).send(appointments);
  } catch (error) {
    handleErrorResponse(
      error,
      reply,
      "Ocorreu um erro ao buscar os agendamentos do mês"
    );
  }
};

const getDashboardAppointmentsDay = async (request, reply) => {
  try {
    const appointments = await dashboardService.getAppointmentsDay();
    reply.status(StatusCodes.OK).send(appointments);
  } catch (error) {
    handleErrorResponse(
      error,
      reply,
      "Ocorreu um erro ao buscar os agendamentos do dia"
    );
  }
};

const getDashboardAppointmentsInterval = async (request, reply) => {
  try {
    const { start_date, end_date } = periodSchemaQuery.parse(request.query);
    const appointments = await dashboardService.getAppointmentsInterval(
      start_date,
      end_date
    );
    reply.status(StatusCodes.OK).send(appointments);
  } catch (error) {
    handleErrorResponse(
      error,
      reply,
      "Ocorreu um erro ao buscar os agendamentos no intervalo"
    );
  }
};

const getDashboardServicesInterval = async (request, reply) => {
  try {
    const { start_date, end_date } = periodSchemaQuery.parse(request.query);
    const services = await dashboardService.getServicesInterval(
      start_date,
      end_date
    );
    reply.status(StatusCodes.OK).send(services);
  } catch (error) {
    handleErrorResponse(
      error,
      reply,
      "Ocorreu um erro ao buscar os serviços no intervalo"
    );
  }
};

const getDashboardAppointmentsCanceled = async (request, reply) => {
  try {
    const appointments = await dashboardService.getAppointmentsCanceled();
    reply.status(StatusCodes.OK).send(appointments);
  } catch (error) {
    handleErrorResponse(
      error,
      reply,
      "Ocorreu um erro ao buscar os agendamentos cancelados"
    );
  }
};

export default {
  getDashboardTotalMonth,
  getDashboardAppointmentsMonth,
  getDashboardAppointmentsDay,
  getDashboardAppointmentsInterval,
  getDashboardServicesInterval,
  getDashboardAppointmentsCanceled,
};
