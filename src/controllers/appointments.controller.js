import { StatusCodes } from "http-status-codes";
import appointmentsService from "../services/appointments.service.js";
import appointmentsRepository from "../repositories/appointments.repository.js";
import { z } from "zod";

const ERROR_MESSAGES = {
  professionalServiceNotFound: "Serviço profissional não encontrado",
  clientNotFound: "Cliente não encontrado",
  appointmentNotFound: "Agendamento não encontrado",
  invalidDate: "Data inválida",
  invalidUUID: "ID deve ser um UUID",
  invalidStatus: "Status inválido",
  errorCreatingAppointment: "Ocorreu um erro ao cadastrar o agendamento",
  errorUpdatingAppointment: "Ocorreu um erro ao atualizar o agendamento",
  errorFetchingAppointments: "Ocorreu um erro ao buscar os agendamentos",
  errorFetchingAppointment: "Ocorreu um erro ao buscar o agendamento",
  errorDeletingAppointment: "Ocorreu um erro ao deletar o agendamento",
};

const validateZod = (schema, data) => {
  try {
    return schema.parse(data);
  } catch (error) {
    throw error instanceof z.ZodError ? error : new Error("Validation failed");
  }
};

const handleError = (error, reply) => {
  console.error(error);
  if (error instanceof z.ZodError) {
    return reply.code(StatusCodes.BAD_REQUEST).send({
      error: error.errors.map((e) => ({
        message: e.message,
        field: e.path[0],
      })),
    });
  }

  const errorMessageMap = {
    "Professional service not found":
      ERROR_MESSAGES.professionalServiceNotFound,
    "Client not found": ERROR_MESSAGES.clientNotFound,
    "Appointment not found": ERROR_MESSAGES.appointmentNotFound,
  };

  return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
    error:
      errorMessageMap[error.message] || ERROR_MESSAGES.errorCreatingAppointment,
  });
};

const postAppointment = async (request, reply) => {
  try {
    const schemaBody = z.object({
      professionalServiceId: z
        .string()
        .uuid({ message: ERROR_MESSAGES.invalidUUID }),
      clientId: z.string().uuid({ message: ERROR_MESSAGES.invalidUUID }),
      dateTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: ERROR_MESSAGES.invalidDate,
      }),
      observation: z.string().optional(),
    });

    const { professionalServiceId, clientId, dateTime, observation } =
      validateZod(schemaBody, request.body);

    const appointment = await appointmentsService.postAppointment(
      professionalServiceId,
      clientId,
      dateTime,
      observation
    );
    reply.status(StatusCodes.CREATED).send(appointment);
  } catch (error) {
    handleError(error, reply);
  }
};

const patchAppointment = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id_appointment: z.string().uuid("Id do appointment deve ser um UUID"),
    });

    const schemaBody = z.object({
      professionalServiceId: z
        .string()
        .uuid({ message: ERROR_MESSAGES.invalidUUID }),
      dateTime: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
          message: ERROR_MESSAGES.invalidDate,
        }),
      status: z.enum(["pending", "confirmed", "completed", "canceled"], {
        message: ERROR_MESSAGES.invalidStatus,
      }),
      observation: z.string().optional(),
    });

    const { id_appointment } = validateZod(schemaParams, request.params);
    const { professionalServiceId, dateTime, observation, status } =
      validateZod(schemaBody, request.body);

    const appointment = await appointmentsService.patchAppointment(
      id_appointment,
      professionalServiceId,
      dateTime,
      observation
    );
    reply.send(appointment);
  } catch (error) {
    handleError(error, reply);
  }
};

const getAppointments = async (request, reply) => {
  try {
    const appointments = await appointmentsService.getAppointments();
    reply.send(appointments);
  } catch (error) {
    handleError(error, reply);
  }
};

const getAppointmentById = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id_appointment: z.string().uuid("Id do appointment deve ser um UUID"),
    });

    const { id_appointment } = validateZod(schemaParams, request.params);
    const appointment = await appointmentsService.getAppointmentById(
      id_appointment
    );
    reply.send(appointment);
  } catch (error) {
    handleError(error, reply);
  }
};

const deleteAppointment = async (request, reply) => {
  try {
    const schemaBody = z.object({
      id_appointment: z.string().uuid("Id do appointment deve ser um UUID"),
    });

    const { id_appointment } = validateZod(schemaBody, request.params);

    await appointmentsRepository.getAppointmentById(id_appointment);
    await appointmentsService.deleteAppointment(id_appointment);

    reply.code(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    handleError(error, reply);
  }
};

export default {
  postAppointment,
  patchAppointment,
  getAppointments,
  getAppointmentById,
  deleteAppointment,
};
