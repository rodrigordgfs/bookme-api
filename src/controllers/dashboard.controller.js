import dashboardService from "../services/dashboard.service.js";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

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

    reply.send(dashboard).status(StatusCodes.OK);
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      error: "Ocorreu um erro ao buscar os agendamentos",
    });
  }
}

const getDashboardAppointmentsMonth = async (request, reply) => {
  try {
    const appointments = await dashboardService.getAppointmentsMonth();

    reply.send(appointments).status(StatusCodes.OK);
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      error: "Ocorreu um erro ao buscar os agendamentos",
    });
  }
}

const getDashboardAppointmentsDay = async (request, reply) => {
  try {
    const appointments = await dashboardService.getAppointmentsDay();

    reply.send(appointments).status(StatusCodes.OK);
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      error: "Ocorreu um erro ao buscar os agendamentos",
    });
  }
}

const getDashboardAppointmentsInterval = async (request, reply) => {
  try {
    const { start_date, end_date } = periodSchemaQuery.parse(request.query);

    const appointments = await dashboardService.getAppointmentsInterval(start_date, end_date);

    reply.send(appointments).status(StatusCodes.OK);
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
    
    reply.code(500).send({
      error: "Ocorreu um erro ao buscar os agendamentos",
    });
  }
}

const getDashboardServicesInterval = async (request, reply) => {
  try {
    const { start_date, end_date } = periodSchemaQuery.parse(request.query);

    const services = await dashboardService.getServicesInterval(start_date, end_date);

    reply.send(services).status(StatusCodes.OK);
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
    
    reply.code(500).send({
      error: "Ocorreu um erro ao buscar os serviços",
    });
  }
}

const getDashboardAppointmentsCanceled = async (request, reply) => {
  try {
    const appointments = await dashboardService.getAppointmentsCanceled();

    reply.send(appointments).status(StatusCodes.OK);
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      error: "Ocorreu um erro ao buscar os agendamentos",
    });
  }
}

export default {
  getDashboardTotalMonth,
  getDashboardAppointmentsMonth,
  getDashboardAppointmentsDay,
  getDashboardAppointmentsInterval,
  getDashboardServicesInterval,
  getDashboardAppointmentsCanceled
};
